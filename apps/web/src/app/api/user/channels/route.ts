import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/channels — list the user's saved channels
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const channels = await prisma.userChannel.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(channels);
}

// POST /api/user/channels — upsert channel selections + complete onboarding
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const { channels } = await req.json() as {
    channels: { channel: string; token?: string; notes?: string; enabled: boolean }[];
  };

  if (!Array.isArray(channels)) {
    return NextResponse.json({ error: "channels must be an array" }, { status: 400 });
  }

  const ALLOWED = new Set([
    "telegram", "whatsapp", "discord", "slack", "signal",
    "imessage", "teams", "matrix", "zalo", "voice",
  ]);

  for (const ch of channels) {
    if (!ALLOWED.has(ch.channel)) {
      return NextResponse.json({ error: `Unknown channel: ${ch.channel}` }, { status: 400 });
    }
  }

  // Upsert each channel
  await Promise.all(
    channels.map((ch) =>
      prisma.userChannel.upsert({
        where: { userId_channel: { userId, channel: ch.channel } },
        create: { userId, channel: ch.channel, token: ch.token ?? null, notes: ch.notes ?? null, enabled: ch.enabled },
        update: { token: ch.token ?? null, notes: ch.notes ?? null, enabled: ch.enabled },
      }),
    ),
  );

  // Remove channels that were deselected
  const selectedChannels = channels.filter((c) => c.enabled).map((c) => c.channel);
  await prisma.userChannel.deleteMany({
    where: { userId, channel: { notIn: selectedChannels } },
  });

  // Mark onboarding complete
  await prisma.user.update({
    where: { id: userId },
    data: { onboardingCompleted: true },
  });

  return NextResponse.json({ success: true });
}
