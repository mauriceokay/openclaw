"use client";

export default function BillingButton({ label }: { label: string }) {
  async function handlePortal() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <button className="btn btn-outline" onClick={handlePortal}>
      {label}
    </button>
  );
}
