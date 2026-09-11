import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { Loader2, ShieldCheck, RefreshCw } from "lucide-react";

interface OtpVerifyProps {
  /** Called when the user has entered all 6 digits */
  onVerify: (otp: string) => Promise<void> | void;
  /** Called when user requests resend */
  onResend?: () => void;
  /** Email or masked destination for display */
  destination?: string;
  /** Countdown seconds for resend (default: 30) */
  cooldown?: number;
}

export default function OtpVerify({
  onVerify,
  onResend,
  destination = "your email",
  cooldown = 30,
}: OtpVerifyProps) {
  const LENGTH = 6;
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [seconds, setSeconds] = useState(cooldown);
  const [shaking, setShaking] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  function focus(index: number) {
    refs.current[index]?.focus();
  }

  function handleChange(index: number, val: string) {
    const char = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError("");
    if (char && index < LENGTH - 1) focus(index + 1);
    // auto-submit when last filled
    if (char && index === LENGTH - 1) {
      const full = [...next.slice(0, LENGTH - 1), char].join("");
      if (full.length === LENGTH) submit(full);
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        focus(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focus(index - 1);
    } else if (e.key === "ArrowRight" && index < LENGTH - 1) {
      focus(index + 1);
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    const next = Array(LENGTH).fill("");
    pasted.split("").forEach((c, i) => { next[i] = c; });
    setDigits(next);
    focus(Math.min(pasted.length, LENGTH - 1));
    if (pasted.length === LENGTH) submit(pasted);
  }

  async function submit(otp: string) {
    setBusy(true);
    setError("");
    try {
      await onVerify(otp);
      setSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid code. Please try again.";
      setError(msg);
      setDigits(Array(LENGTH).fill(""));
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      focus(0);
    } finally {
      setBusy(false);
    }
  }

  function resend() {
    setSeconds(cooldown);
    setError("");
    setDigits(Array(LENGTH).fill(""));
    focus(0);
    onResend?.();
  }

  const allFilled = digits.every(Boolean);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0",
      }}
    >
      {/* Icon badge */}
      <div style={{
        width: "56px",
        height: "56px",
        borderRadius: "18px",
        background: "rgba(34,211,238,0.10)",
        border: "1px solid rgba(34,211,238,0.20)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
      }}>
        {success
          ? <ShieldCheck size={24} style={{ color: "#22d3ee" }} />
          : <ShieldCheck size={24} style={{ color: "#22d3ee" }} />
        }
      </div>

      {/* Heading */}
      <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#f5f5f3", letterSpacing: "-0.03em", textAlign: "center", margin: 0 }}>
        {success ? "Verified!" : "Check your inbox"}
      </h2>
      <p style={{ marginTop: "8px", fontSize: "13px", color: "#70706b", textAlign: "center", lineHeight: 1.6 }}>
        {success
          ? "You're all set. Redirecting you now."
          : <>We sent a 6-digit code to <strong style={{ color: "#a5a5a0" }}>{destination}</strong>.</>}
      </p>

      {!success && (
        <>
          {/* OTP boxes */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "28px",
              animation: shaking ? "shake 0.4s ease" : undefined,
            }}
          >
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                style={{
                  width: "48px",
                  height: "56px",
                  textAlign: "center",
                  fontSize: "22px",
                  fontWeight: 700,
                  borderRadius: "14px",
                  border: `1.5px solid ${
                    error ? "rgba(255,100,100,0.40)" :
                    d ? "rgba(245,245,243,0.20)" :
                    "#242424"
                  }`,
                  background: d ? "rgba(245,245,243,0.06)" : "rgba(13,13,13,0.8)",
                  color: "#f5f5f3",
                  outline: "none",
                  transition: "border-color 0.15s ease, background 0.15s ease, transform 0.12s ease",
                  transform: d ? "scale(1.04)" : "scale(1)",
                  caretColor: "transparent",
                  boxShadow: d ? "0 0 0 1px rgba(245,245,243,0.06)" : "none",
                }}
                disabled={busy}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <p style={{ marginTop: "14px", fontSize: "13px", color: "#ff7c7c", fontWeight: 500 }}>
              {error}
            </p>
          )}

          {/* Verify button (shown when all filled but not auto-submitted) */}
          {allFilled && !busy && (
            <button
              onClick={() => submit(digits.join(""))}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "13px",
                borderRadius: "12px",
                background: "#f5f5f3",
                color: "#080808",
                fontSize: "14px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              Verify code
            </button>
          )}

          {busy && (
            <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "8px", color: "#a5a5a0" }}>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: "14px" }}>Verifying…</span>
            </div>
          )}

          {/* Resend */}
          <div style={{ marginTop: "24px", fontSize: "13px", color: "#70706b", textAlign: "center" }}>
            {seconds > 0 ? (
              <>Resend code in <strong style={{ color: "#a5a5a0" }}>{seconds}s</strong></>
            ) : (
              <button
                onClick={resend}
                style={{
                  background: "none",
                  border: "none",
                  color: "#f5f5f3",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "13px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <RefreshCw size={13} /> Resend code
              </button>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
