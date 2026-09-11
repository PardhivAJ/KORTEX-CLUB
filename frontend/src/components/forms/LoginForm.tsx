import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, ChevronRight, Loader2 } from "lucide-react";
import type { Role } from "../../types";
import { validateLogin } from "../../utils/validators";

const ROLES: { value: Role; label: string; description: string }[] = [
  { value: "student",  label: "Student",  description: "Access events, attendance & points" },
  { value: "faculty",  label: "Faculty",  description: "Manage classes & requests"          },
  { value: "admin",    label: "Admin",    description: "Full campus administration"          },
];

const DEFAULT_EMAILS: Record<Role, string> = {
  student: "2420080001@klh.edu.in",
  faculty: "meera.rao@klh.edu.in",
  admin: "admin@klh.edu.in",
};

export default function LoginForm({
  onSubmit,
}: {
  onSubmit: (email: string, password: string, role: Role) => Promise<void> | void;
}) {
  const [role, setRole]         = useState<Role>("student");
  const [email, setEmail]       = useState(DEFAULT_EMAILS.student);
  const [password, setPassword] = useState("123456");
  const [show, setShow]         = useState(false);
  const [error, setError]       = useState("");
  const [busy, setBusy]         = useState(false);
  const [focused, setFocused]   = useState<"email" | "password" | null>(null);

  function selectRole(r: Role) {
    setRole(r);
    setEmail(DEFAULT_EMAILS[r]);
    setError("");
  }

  function handleEmailChange(val: string) {
    if (role === "student") {
      if (!val.trim()) {
        setEmail("");
        return;
      }
      const beforeAt = val.split("@")[0];
      const digitsOnly = beforeAt.replace(/\D/g, "");
      setEmail(digitsOnly ? `${digitsOnly}@klh.edu.in` : "");
    } else {
      setEmail(val);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateLogin(email, password, role);
    if (Object.keys(errors).length) { setError(Object.values(errors)[0]); return; }
    setBusy(true); setError("");
    try { await onSubmit(email, password, role); }
    catch (err) { setError(err instanceof Error ? err.message : "Login failed"); }
    finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-[400px]" noValidate>
      {/* Header */}
      <div className="mb-8">
        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#f5f5f3", letterSpacing: "-0.03em", lineHeight: 1.15, margin: 0 }}>
          Sign in to Kortex
        </h2>
        <p style={{ marginTop: "8px", fontSize: "14px", color: "#70706b" }}>
          Your campus operating system awaits.
        </p>
      </div>

      {/* Role selector */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#70706b", marginBottom: "10px" }}>
          Portal
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          {ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => selectRole(r.value)}
              style={{
                flex: 1,
                padding: "10px 8px",
                borderRadius: "12px",
                border: `1px solid ${role === r.value ? "rgba(245,245,243,0.18)" : "#242424"}`,
                background: role === r.value ? "rgba(245,245,243,0.08)" : "rgba(13,13,13,0.6)",
                color: role === r.value ? "#f5f5f3" : "#70706b",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
                textAlign: "center",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
        <p style={{ marginTop: "8px", fontSize: "12px", color: "#70706b", textAlign: "center" }}>
          {ROLES.find(r => r.value === role)?.description}
        </p>
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "18px" }}>
        {/* Email */}
        <label style={{ display: "block" }}>
          <span style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 700, color: "#a5a5a0", letterSpacing: "0.05em" }}>
            Email address
          </span>
          <div style={{ position: "relative" }}>
            <Mail
              size={16}
              style={{
                position: "absolute",
                left: "13px",
                top: "50%",
                transform: "translateY(-50%)",
                color: focused === "email" ? "#f5f5f3" : "#70706b",
                transition: "color 0.15s",
              }}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              placeholder={role === "student" ? "2420080001@klh.edu.in" : "you@klh.edu.in"}
              style={{
                width: "100%",
                padding: "11px 14px 11px 38px",
                borderRadius: "12px",
                border: `1px solid ${focused === "email" ? "rgba(245,245,243,0.20)" : "#242424"}`,
                background: "rgba(13,13,13,0.8)",
                color: "#f5f5f3",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.15s ease",
                boxSizing: "border-box",
              }}
            />
          </div>
          {role === "student" && (
            <p style={{ marginTop: "4px", fontSize: "11px", color: "#70706b" }}>
              Student email prefix accepts numbers only (e.g. 2420080001@klh.edu.in)
            </p>
          )}
        </label>

        {/* Password */}
        <label style={{ display: "block" }}>
          <span style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 700, color: "#a5a5a0", letterSpacing: "0.05em" }}>
            Password
          </span>
          <div style={{ position: "relative" }}>
            <LockKeyhole
              size={16}
              style={{
                position: "absolute",
                left: "13px",
                top: "50%",
                transform: "translateY(-50%)",
                color: focused === "password" ? "#f5f5f3" : "#70706b",
                transition: "color 0.15s",
              }}
            />
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              style={{
                width: "100%",
                padding: "11px 44px 11px 38px",
                borderRadius: "12px",
                border: `1px solid ${focused === "password" ? "rgba(245,245,243,0.20)" : "#242424"}`,
                background: "rgba(13,13,13,0.8)",
                color: "#f5f5f3",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.15s ease",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#70706b",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
              }}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: "16px",
          padding: "10px 14px",
          borderRadius: "10px",
          background: "rgba(255,60,60,0.08)",
          border: "1px solid rgba(255,60,60,0.18)",
          color: "#ff7c7c",
          fontSize: "13px",
          fontWeight: 500,
        }}>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={busy}
        className="btn-primary w-full"
        onMouseEnter={(e) => { if (!busy) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.01)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
      >
        {busy ? (
          <>
            <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <ChevronRight size={16} />
          </>
        )}
      </button>

      {/* Footer */}
      <p style={{ marginTop: "20px", textAlign: "center", fontSize: "13px", color: "#70706b" }}>
        New to Kortex?{" "}
        <Link to="/register" style={{ color: "#f5f5f3", fontWeight: 700 }}>
          Create account
        </Link>
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #4a4a47; }
      `}</style>
    </form>
  );
}