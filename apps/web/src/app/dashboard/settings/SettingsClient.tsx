"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

type Props = {
  user: { id: string; name: string | null; email: string | null; hasPassword: boolean };
};

export default function SettingsClient({ user }: Props) {
  const router = useRouter();

  // --- Profile form ---
  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    setProfileLoading(true);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    setProfileLoading(false);
    if (res.ok) {
      setProfileMsg({ ok: true, text: "Profile updated." });
      router.refresh();
    } else {
      setProfileMsg({ ok: false, text: data.error ?? "Failed to update profile." });
    }
  }

  // --- Password form ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (newPassword !== confirmPassword) {
      setPwMsg({ ok: false, text: "Passwords do not match." });
      return;
    }
    setPwLoading(true);
    const res = await fetch("/api/user/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setPwLoading(false);
    if (res.ok) {
      setPwMsg({ ok: true, text: "Password changed successfully." });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } else {
      setPwMsg({ ok: false, text: data.error ?? "Failed to change password." });
    }
  }

  // --- Delete account ---
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  async function deleteAccount(e: React.FormEvent) {
    e.preventDefault();
    if (deleteConfirm !== "delete my account") {
      setDeleteMsg('Type "delete my account" to confirm.');
      return;
    }
    setDeleteLoading(true);
    const res = await fetch("/api/user/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: deletePassword }),
    });
    const data = await res.json();
    if (res.ok) {
      await signOut({ callbackUrl: "/" });
    } else {
      setDeleteMsg(data.error ?? "Failed to delete account.");
      setDeleteLoading(false);
    }
  }

  const card: React.CSSProperties = {
    background: "#111",
    border: "1px solid #1f1f1f",
    borderRadius: 16,
    padding: "1.75rem",
    marginBottom: "1.5rem",
  };

  return (
    <div>
      {/* Profile */}
      <div style={card}>
        <h2 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.25rem" }}>Profile</h2>
        <form onSubmit={saveProfile} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 440 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.4rem", color: "#ccc" }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.4rem", color: "#ccc" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {profileMsg && (
            <p className={profileMsg.ok ? "success-msg" : "error-msg"}>{profileMsg.text}</p>
          )}
          <button type="submit" className="btn btn-primary" disabled={profileLoading} style={{ alignSelf: "flex-start" }}>
            {profileLoading ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>

      {/* Password */}
      <div style={card}>
        <h2 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.25rem" }}>
          {user.hasPassword ? "Change password" : "Set a password"}
        </h2>
        <form onSubmit={changePassword} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 440 }}>
          {user.hasPassword && (
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.4rem", color: "#ccc" }}>
                Current password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          )}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.4rem", color: "#ccc" }}>
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.4rem", color: "#ccc" }}>
              Confirm new password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {pwMsg && (
            <p className={pwMsg.ok ? "success-msg" : "error-msg"}>{pwMsg.text}</p>
          )}
          <button type="submit" className="btn btn-primary" disabled={pwLoading} style={{ alignSelf: "flex-start" }}>
            {pwLoading ? "Saving…" : "Update password"}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div style={{ ...card, border: "1px solid rgba(239,68,68,0.3)" }}>
        <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "#ef4444", marginBottom: "0.5rem" }}>
          Danger zone
        </h2>
        <p style={{ color: "#888", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
          Permanently delete your account and all associated data. This cannot be undone.
          Any active subscription will be cancelled immediately.
        </p>

        {!showDelete ? (
          <button className="btn" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }} onClick={() => setShowDelete(true)}>
            Delete my account
          </button>
        ) : (
          <form onSubmit={deleteAccount} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 440 }}>
            {user.hasPassword && (
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.4rem", color: "#ccc" }}>
                  Your password
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            )}
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.4rem", color: "#ccc" }}>
                Type <strong>delete my account</strong> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="delete my account"
              />
            </div>
            {deleteMsg && <p className="error-msg">{deleteMsg}</p>}
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button
                type="submit"
                disabled={deleteLoading}
                className="btn"
                style={{ background: "#ef4444", color: "#fff" }}
              >
                {deleteLoading ? "Deleting…" : "Delete account"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => { setShowDelete(false); setDeleteMsg(""); }}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
