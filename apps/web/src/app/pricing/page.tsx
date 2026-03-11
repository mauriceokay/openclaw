"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { PLANS } from "@/lib/stripe";

const FREE_FEATURES = [
  "Up to 50 messages/day",
  "2 messaging channels",
  "Basic memory",
  "Community support",
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new") === "true";

  async function handleCheckout(plan: "pro" | "team") {
    if (!session) {
      router.push("/register");
      return;
    }
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <>
      <Navbar />
      <main style={{ padding: "5rem 1.5rem" }}>
        <div className="container">
          {isNew && (
            <div style={{
              background: "rgba(224,90,43,0.08)",
              border: "1px solid rgba(224,90,43,0.25)",
              borderRadius: 12,
              padding: "1rem 1.5rem",
              textAlign: "center",
              marginBottom: "2.5rem",
              fontSize: "0.95rem",
            }}>
              Account created! Pick a plan to unlock full access, or continue free.
            </div>
          )}
          <h1 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.75rem" }}>
            Simple, transparent pricing
          </h1>
          <p style={{ textAlign: "center", color: "#777", marginBottom: "3.5rem", fontSize: "1.1rem" }}>
            Start free. Upgrade when you need more power.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
            maxWidth: 900,
            margin: "0 auto",
          }}>
            {/* Free */}
            <div style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: 16,
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "0.25rem" }}>Free</div>
              <div style={{ color: "#777", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Get started at no cost</div>
              <div style={{ marginBottom: "1.75rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>$0</span>
                <span style={{ color: "#666", fontSize: "0.9rem" }}> / month</span>
              </div>
              <ul style={{ listStyle: "none", flex: 1, marginBottom: "1.5rem" }}>
                {FREE_FEATURES.map((f) => (
                  <li key={f} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.6rem", fontSize: "0.9rem", color: "#ccc" }}>
                    <span style={{ color: "#22c55e" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn btn-outline" style={{ width: "100%", textAlign: "center" }}>
                Get started
              </Link>
            </div>

            {/* Pro */}
            <div style={{
              background: "#111",
              border: "2px solid #e05a2b",
              borderRadius: 16,
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}>
              <div style={{
                position: "absolute",
                top: -14,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#e05a2b",
                color: "#fff",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.25rem 0.8rem",
                borderRadius: 999,
                letterSpacing: "0.05em",
              }}>MOST POPULAR</div>
              <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "0.25rem" }}>{PLANS.pro.name}</div>
              <div style={{ color: "#777", fontSize: "0.875rem", marginBottom: "1.5rem" }}>{PLANS.pro.description}</div>
              <div style={{ marginBottom: "1.75rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>${PLANS.pro.price}</span>
                <span style={{ color: "#666", fontSize: "0.9rem" }}> / month</span>
              </div>
              <ul style={{ listStyle: "none", flex: 1, marginBottom: "1.5rem" }}>
                {PLANS.pro.features.map((f) => (
                  <li key={f} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.6rem", fontSize: "0.9rem", color: "#ccc" }}>
                    <span style={{ color: "#22c55e" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-primary"
                style={{ width: "100%" }}
                onClick={() => handleCheckout("pro")}
              >
                {session ? "Upgrade to Pro" : "Get started"}
              </button>
            </div>

            {/* Team */}
            <div style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: 16,
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "0.25rem" }}>{PLANS.team.name}</div>
              <div style={{ color: "#777", fontSize: "0.875rem", marginBottom: "1.5rem" }}>{PLANS.team.description}</div>
              <div style={{ marginBottom: "1.75rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>${PLANS.team.price}</span>
                <span style={{ color: "#666", fontSize: "0.9rem" }}> / month</span>
              </div>
              <ul style={{ listStyle: "none", flex: 1, marginBottom: "1.5rem" }}>
                {PLANS.team.features.map((f) => (
                  <li key={f} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.6rem", fontSize: "0.9rem", color: "#ccc" }}>
                    <span style={{ color: "#22c55e" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-outline"
                style={{ width: "100%" }}
                onClick={() => handleCheckout("team")}
              >
                {session ? "Upgrade to Team" : "Get started"}
              </button>
            </div>
          </div>

          <p style={{ textAlign: "center", color: "#555", marginTop: "3rem", fontSize: "0.875rem" }}>
            All plans include a 14-day free trial. Cancel anytime.
          </p>
        </div>
      </main>
    </>
  );
}
