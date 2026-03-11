import Link from "next/link";
import Navbar from "@/components/Navbar";

const CHANNELS = [
  "WhatsApp", "Telegram", "Slack", "Discord", "Signal",
  "iMessage", "Microsoft Teams", "Matrix", "IRC", "LINE",
  "Google Chat", "Mattermost", "Nostr", "Twitch", "Zalo",
];

const FEATURES = [
  {
    icon: "💬",
    title: "20+ Messaging Channels",
    desc: "Connect your AI assistant to WhatsApp, Telegram, Slack, Discord, and more — all from one place.",
  },
  {
    icon: "🧠",
    title: "Persistent Memory",
    desc: "OpenClaw remembers context across conversations, devices, and channels.",
  },
  {
    icon: "🎙️",
    title: "Voice & TTS",
    desc: "Speak and listen on macOS, iOS, and Android. Your assistant is always ready.",
  },
  {
    icon: "🔒",
    title: "Self-hosted & Private",
    desc: "Run on your own devices. Your data never leaves your infrastructure.",
  },
  {
    icon: "🛠️",
    title: "Extensible Skills",
    desc: "Build and install custom skills to extend what your assistant can do.",
  },
  {
    icon: "⚡",
    title: "Real-time Canvas",
    desc: "Render a live, interactive canvas that you control from any channel.",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section style={{
          textAlign: "center",
          padding: "7rem 1.5rem 5rem",
          maxWidth: 800,
          margin: "0 auto",
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(224,90,43,0.12)",
            border: "1px solid rgba(224,90,43,0.3)",
            borderRadius: 999,
            padding: "0.3rem 0.9rem",
            fontSize: "0.85rem",
            color: "#e05a2b",
            marginBottom: "1.5rem",
          }}>
            🦞 Personal AI Assistant
          </div>
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "1.2rem",
            letterSpacing: "-0.03em",
          }}>
            Your AI, everywhere<br />
            <span style={{ color: "#e05a2b" }}>you already are.</span>
          </h1>
          <p style={{
            fontSize: "1.2rem",
            color: "#999",
            maxWidth: 560,
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
          }}>
            OpenClaw is a personal AI assistant you run on your own devices.
            It answers you on the channels you already use.
          </p>
          <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn btn-primary" style={{ fontSize: "1rem", padding: "0.8rem 2rem" }}>
              Get started free
            </Link>
            <Link href="/pricing" className="btn btn-outline" style={{ fontSize: "1rem", padding: "0.8rem 2rem" }}>
              View pricing
            </Link>
          </div>
        </section>

        {/* Channel badges */}
        <section style={{ padding: "2rem 1.5rem 4rem", textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Works with
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", maxWidth: 700, margin: "0 auto" }}>
            {CHANNELS.map((ch) => (
              <span key={ch} style={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 999,
                padding: "0.3rem 0.8rem",
                fontSize: "0.85rem",
                color: "#ccc",
              }}>{ch}</span>
            ))}
            <span style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: 999,
              padding: "0.3rem 0.8rem",
              fontSize: "0.85rem",
              color: "#666",
            }}>+ more</span>
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: "4rem 1.5rem", background: "#0d0d0d" }}>
          <div className="container">
            <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Everything you need
            </h2>
            <p style={{ textAlign: "center", color: "#777", marginBottom: "3rem" }}>
              Built for individuals who want a powerful, private AI assistant.
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}>
              {FEATURES.map((f) => (
                <div key={f.title} style={{
                  background: "#111",
                  border: "1px solid #1f1f1f",
                  borderRadius: 12,
                  padding: "1.5rem",
                }}>
                  <div style={{ fontSize: "1.75rem", marginBottom: "0.6rem" }}>{f.icon}</div>
                  <h3 style={{ fontWeight: 600, marginBottom: "0.4rem" }}>{f.title}</h3>
                  <p style={{ color: "#888", fontSize: "0.92rem", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: "1rem" }}>
            Ready to get started?
          </h2>
          <p style={{ color: "#777", marginBottom: "2rem" }}>
            Free plan available. No credit card required.
          </p>
          <Link href="/register" className="btn btn-primary" style={{ fontSize: "1rem", padding: "0.8rem 2.5rem" }}>
            Create your account
          </Link>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: "1px solid #1a1a1a",
          padding: "2rem 1.5rem",
          textAlign: "center",
          color: "#555",
          fontSize: "0.875rem",
        }}>
          <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/pricing">Pricing</Link>
            <a href="https://docs.openclaw.ai" target="_blank" rel="noopener noreferrer">Docs</a>
            <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer">GitHub</a>
            <Link href="/login">Sign in</Link>
          </div>
          <p style={{ marginTop: "1rem" }}>© {new Date().getFullYear()} OpenClaw. MIT License.</p>
        </footer>
      </main>
    </>
  );
}
