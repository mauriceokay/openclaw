"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ChannelDef = {
  id: string;
  label: string;
  icon: string;
  description: string;
  tokenLabel?: string;
  tokenPlaceholder?: string;
  notesLabel?: string;
  notesSingleLine?: boolean;
};

const CHANNELS: ChannelDef[] = [
  {
    id: "telegram",
    label: "Telegram",
    icon: "✈️",
    description: "Connect via a Telegram bot token.",
    tokenLabel: "Bot token",
    tokenPlaceholder: "123456789:AAXXXXXXXX...",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "💬",
    description: "Connect WhatsApp Web — scan the QR code after setup.",
    notesLabel: "Notes (optional)",
  },
  {
    id: "discord",
    label: "Discord",
    icon: "🎮",
    description: "Connect via a Discord bot token.",
    tokenLabel: "Bot token",
    tokenPlaceholder: "MTxxxxxxx.xxxxxx.xxxxxxxxxxxx",
  },
  {
    id: "slack",
    label: "Slack",
    icon: "🟣",
    description: "Connect via a Slack app bot token.",
    tokenLabel: "Bot OAuth token",
    tokenPlaceholder: "xoxb-...",
  },
  {
    id: "signal",
    label: "Signal",
    icon: "🔒",
    description: "Connect your Signal account via signal-cli.",
    tokenLabel: "Phone number",
    tokenPlaceholder: "+12025551234",
  },
  {
    id: "imessage",
    label: "iMessage",
    icon: "💙",
    description: "Connect via BlueBubbles on a Mac running your Apple ID.",
    notesLabel: "BlueBubbles server URL",
    notesSingleLine: true,
  },
  {
    id: "teams",
    label: "Microsoft Teams",
    icon: "🏢",
    description: "Connect via a Teams bot app credentials.",
    tokenLabel: "App ID",
    tokenPlaceholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    notesLabel: "App password",
    notesSingleLine: true,
  },
  {
    id: "matrix",
    label: "Matrix",
    icon: "🌐",
    description: "Connect via a Matrix homeserver and access token.",
    tokenLabel: "Access token",
    tokenPlaceholder: "syt_...",
    notesLabel: "Homeserver URL",
    notesSingleLine: true,
  },
  {
    id: "zalo",
    label: "Zalo",
    icon: "🇻🇳",
    description: "Connect Zalo OA (Official Account).",
    tokenLabel: "Access token",
    tokenPlaceholder: "v3.xxx...",
  },
  {
    id: "voice",
    label: "Voice / Phone",
    icon: "📞",
    description: "Enable inbound/outbound voice calls via Twilio.",
    tokenLabel: "Twilio account SID",
    tokenPlaceholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    notesLabel: "Twilio auth token",
    notesSingleLine: true,
  },
];

export default function OnboardingClient({ upgraded = false }: { upgraded?: boolean }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"pick" | "configure">("pick");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleChannel(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function finish() {
    setLoading(true);
    setError("");
    const channels = CHANNELS.filter((c) => selected.has(c.id)).map((c) => ({
      channel: c.id,
      token: tokens[c.id] ?? "",
      notes: notes[c.id] ?? "",
      enabled: true,
    }));

    const res = await fetch("/api/user/channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channels }),
    });

    if (res.ok) {
      router.push("/dashboard?onboarded=true");
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      setLoading(false);
    }
  }

  const selectedList = CHANNELS.filter((c) => selected.has(c.id));

  const card: React.CSSProperties = {
    background: "#111",
    border: "1px solid #1f1f1f",
    borderRadius: 14,
    padding: "1.25rem",
    cursor: "pointer",
    transition: "border-color .15s",
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "3rem 1.5rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔗</div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.4rem" }}>
          {step === "pick" ? "Which channels do you want to connect?" : "Configure your channels"}
        </h1>
        <p style={{ color: "#777", fontSize: "0.95rem" }}>
          {step === "pick"
            ? "Select all the messaging platforms you plan to use. You can add more later."
            : "Enter the credentials for each channel. Leave blank to configure later."}
        </p>
      </div>

      {upgraded && (
        <div style={{
          background: "rgba(34,197,94,0.08)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: 10,
          padding: "0.875rem 1.25rem",
          color: "#22c55e",
          fontSize: "0.9rem",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}>
          Payment confirmed — now let&#39;s connect your channels.
        </div>
      )}
      {step === "pick" ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "0.85rem", marginBottom: "2rem" }}>
            {CHANNELS.map((ch) => {
              const active = selected.has(ch.id);
              return (
                <div
                  key={ch.id}
                  style={{
                    ...card,
                    borderColor: active ? "rgba(224,90,43,0.6)" : "#1f1f1f",
                    background: active ? "rgba(224,90,43,0.06)" : "#111",
                  }}
                  onClick={() => toggleChannel(ch.id)}
                >
                  <div style={{ fontSize: "1.6rem", lineHeight: 1, flexShrink: 0 }}>{ch.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{ch.label}</span>
                      <span style={{
                        width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                        border: active ? "none" : "2px solid #333",
                        background: active ? "#e05a2b" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.7rem", color: "#fff",
                      }}>
                        {active ? "✓" : ""}
                      </span>
                    </div>
                    <p style={{ color: "#777", fontSize: "0.8rem", marginTop: "0.2rem", lineHeight: 1.4 }}>
                      {ch.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#666", fontSize: "0.875rem" }}>
              {selected.size === 0 ? "No channels selected" : `${selected.size} channel${selected.size !== 1 ? "s" : ""} selected`}
            </span>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button
                className="btn btn-ghost"
                onClick={() => router.push("/dashboard")}
              >
                Skip for now
              </button>
              <button
                className="btn btn-primary"
                disabled={selected.size === 0}
                onClick={() => selected.size > 0 && setStep("configure")}
              >
                Continue →
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
            {selectedList.map((ch) => (
              <div key={ch.id} style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 14, padding: "1.5rem" }}>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "1.4rem" }}>{ch.icon}</span>
                  <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{ch.label}</h3>
                  <span style={{ color: "#555", fontSize: "0.8rem" }}>{ch.description}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {ch.tokenLabel && (
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#aaa", marginBottom: "0.35rem" }}>
                        {ch.tokenLabel}
                      </label>
                      <input
                        type="text"
                        value={tokens[ch.id] ?? ""}
                        onChange={(e) => setTokens((p) => ({ ...p, [ch.id]: e.target.value }))}
                        placeholder={ch.tokenPlaceholder ?? ""}
                      />
                    </div>
                  )}
                  {ch.notesLabel && (
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#aaa", marginBottom: "0.35rem" }}>
                        {ch.notesLabel}
                      </label>
                      {ch.notesSingleLine ? (
                        <input
                          type="text"
                          value={notes[ch.id] ?? ""}
                          onChange={(e) => setNotes((p) => ({ ...p, [ch.id]: e.target.value }))}
                          placeholder=""
                        />
                      ) : (
                        <textarea
                          rows={2}
                          value={notes[ch.id] ?? ""}
                          onChange={(e) => setNotes((p) => ({ ...p, [ch.id]: e.target.value }))}
                          placeholder=""
                          style={{ resize: "vertical" }}
                        />
                      )}
                    </div>
                  )}
                  {!ch.tokenLabel && !ch.notesLabel && (
                    <p style={{ color: "#555", fontSize: "0.8rem" }}>
                      No credentials needed here — configuration happens on your gateway after installation.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {error && <p className="error-msg" style={{ marginBottom: "1rem" }}>{error}</p>}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button className="btn btn-ghost" onClick={() => setStep("pick")}>
              ← Back
            </button>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button
                className="btn btn-ghost"
                onClick={() => router.push("/dashboard")}
              >
                Skip
              </button>
              <button
                className="btn btn-primary"
                disabled={loading}
                onClick={finish}
              >
                {loading ? "Saving…" : "Finish setup →"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
