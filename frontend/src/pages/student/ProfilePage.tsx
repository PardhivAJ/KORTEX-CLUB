import { useState } from "react";
import {
  UserRound, MapPin, BookOpen, Mail, Phone, Pencil, Save, X, Star, Trophy, CalendarCheck
} from "lucide-react";
import type { User } from "../../types";
import { authStore } from "../../services/authStore";

interface ProfileStat { label: string; value: string; Icon: React.ElementType }

const TABS = ["Overview", "Edit profile"] as const;
type Tab = typeof TABS[number];

export default function ProfilePage({ user }: { user: User }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [message, setMessage] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const initials = user.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  const stats: ProfileStat[] = [
    { label: "Kortex Points", value: "1,020", Icon: Star },
    { label: "Leaderboard", value: "#5", Icon: Trophy },
    { label: "Events", value: "13", Icon: CalendarCheck },
  ];

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setMessage("Full name is required."); return; }
    authStore.set({ ...user, name: name.trim(), phone: phone.trim() });
    setMessage("Profile saved successfully.");
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div className="page max-w-3xl">
      <p className="eyebrow">Account</p>
      <h1 className="title mt-1">My profile</h1>

      {/* ─── Profile Card ────────────────────────────────────────── */}
      <div style={{
        marginTop: "24px",
        borderRadius: "20px",
        border: `1px solid var(--border)`,
        background: `var(--surface-bg)`,
        overflow: "hidden",
      }}>
        {/* Banner gradient strip */}
        <div style={{
          height: "96px",
          background: "linear-gradient(135deg, rgba(255,138,31,0.20) 0%, rgba(34,211,238,0.10) 50%, rgba(37,99,235,0.15) 100%)",
          borderBottom: "1px solid #1e1e1e",
          position: "relative",
        }}>
          {/* Subtle grid overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(245,245,243,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,243,0.03) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }} />
        </div>

        <div style={{ padding: "0 24px 24px" }}>
          {/* Avatar row */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", marginTop: "-36px", marginBottom: "20px" }}>
            <div style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: `linear-gradient(135deg, var(--surface-bg) 0%, var(--surface-bg-strong) 100%)`,
              color: `var(--text-main)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: 900,
              border: `1px solid var(--border)`,
              flexShrink: 0,
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}>
              {initials}
            </div>
            <div style={{ paddingBottom: "4px", flex: 1 }}>
              <p style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", lineHeight: 1.2 }}>{user.name}</p>
              <p style={{ fontSize: "13px", color: "var(--text-soft)", marginTop: "2px" }}>
                {user.rollNumber ?? ""}{user.rollNumber && user.department ? " · " : ""}{user.department ?? ""}
              </p>
            </div>
            {/* Role badge */}
            <div style={{
              padding: "5px 12px",
              borderRadius: "999px",
              background: `rgba(245,245,243,0.07)`,
              border: `1px solid var(--border)`,
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.10em",
              color: `var(--text-muted)`,
              alignSelf: "flex-start",
              marginTop: "48px",
            }}>
              {user.role}
            </div>
          </div>

          {/* Meta chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
            {[
              { Icon: Mail, text: user.email },
              ...(user.phone ? [{ Icon: Phone, text: user.phone }] : []),
              ...(user.year ? [{ Icon: BookOpen, text: user.year }] : []),
              ...(user.section ? [{ Icon: MapPin, text: `Section ${user.section}` }] : []),
            ].map(({ Icon, text }) => (
              <div key={text} style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                borderRadius: "999px",
                background: "rgba(245,245,243,0.04)",
                border: `1px solid var(--border)`,
                fontSize: "12px",
                color: "var(--text-soft)",
              }}>
                <Icon size={12} />
                {text}
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginBottom: "24px",
          }}>
            {stats.map(({ label, value, Icon }) => (
              <div key={label} style={{
                borderRadius: "14px",
                border: "1px solid var(--border)",
                background: `rgba(245,245,243,0.03)`,
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  background: `rgba(255,138,31,0.10)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Icon size={15} style={{ color: "#ff8a1f" }} />
                </div>
                <div>
                  <p style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", lineHeight: 1 }}>{value}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-soft)", marginTop: "3px", fontWeight: 500 }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex",
            gap: "4px",
            background: "rgba(245,245,243,0.04)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: "24px",
          }}>
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: tab === t ? `rgba(245,245,243,0.10)` : `transparent`,
                  color: tab === t ? `var(--text-main)` : `var(--text-soft)`,
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Overview tab */}
          {tab === "Overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <InfoRow label="Full name" value={user.name} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Roll number" value={user.rollNumber ?? "—"} />
              <InfoRow label="Department" value={user.department ?? "—"} />
              <InfoRow label="Year" value={user.year ?? "—"} />
              <InfoRow label="Section" value={user.section ? `Section ${user.section}` : "—"} />
              <InfoRow label="Phone" value={user.phone || "Not set"} />
            </div>
          )}

          {/* Edit tab */}
          {tab === "Edit profile" && (
            <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <EditField label="Full name" value={name} onChange={setName} focused={focused} setFocused={setFocused} id="name" />
              <EditField label="Phone" value={phone} onChange={setPhone} focused={focused} setFocused={setFocused} id="phone" type="tel" />
              <ReadonlyField label="Email" value={user.email} />
              <ReadonlyField label="Roll number" value={user.rollNumber ?? "—"} />
              <ReadonlyField label="Department" value={user.department ?? "—"} />

              <button
                type="submit"
                style={{
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  background: `var(--text-main)`,
                  color: `var(--bg-main, #080808)`,
                  fontWeight: 700,
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Save size={15} /> Save changes
              </button>
              {message && (
                <p style={{ textAlign: "center", fontSize: "13px", fontWeight: 600, color: "#22d3ee" }} role="status">
                  {message}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: `1px solid var(--border)`,
    }}>
      <span style={{ fontSize: "12px", color: `var(--text-soft)`, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: "13px", color: `var(--text-main)`, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function EditField({ label, value, onChange, focused, setFocused, id, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  focused: string | null; setFocused: (v: string | null) => void;
  id: string; type?: string;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 700, color: "#70706b" }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(id)}
        onBlur={() => setFocused(null)}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: "12px",
          border: `1px solid ${focused === id ? "rgba(245,245,243,0.20)" : "#242424"}`,
          background: "rgba(13,13,13,0.8)",
          color: "#f5f5f3",
          fontSize: "14px",
          outline: "none",
          transition: "border-color 0.15s ease",
          boxSizing: "border-box",
        }}
      />
    </label>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 700, color: "#70706b" }}>
        {label}
      </span>
      <input
        readOnly
        value={value}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: "12px",
          border: "1px solid #1a1a1a",
          background: "rgba(245,245,243,0.02)",
          color: "#4a4a47",
          fontSize: "14px",
          outline: "none",
          boxSizing: "border-box",
          cursor: "not-allowed",
        }}
      />
    </label>
  );

}