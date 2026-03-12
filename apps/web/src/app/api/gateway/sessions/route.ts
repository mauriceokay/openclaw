import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { gatewayRpc, GatewaySession } from "@/lib/gateway";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const sessions = await gatewayRpc<GatewaySession[]>("sessions.list");
    return NextResponse.json(sessions ?? []);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
