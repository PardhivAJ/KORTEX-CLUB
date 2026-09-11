import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import { authStore } from "../../services/authStore";
export default function RegisterPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("2420080001@klh.edu.in");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  function handleEmailChange(val: string) {
    if (!val.trim()) {
      setEmail("");
      return;
    }
    const beforeAt = val.split("@")[0];
    const digitsOnly = beforeAt.replace(/\D/g, "");
    setEmail(digitsOnly ? `${digitsOnly}@klh.edu.in` : "");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || password.length < 4) {
      setErr("Please complete all fields. Password must be at least 4 characters.");
      return;
    }
    const digitsOnly = email.split("@")[0].replace(/\D/g, "");
    if (!digitsOnly || !email.endsWith("@klh.edu.in")) {
      setErr("Student email must be roll number digits followed by @klh.edu.in (e.g. 2420080001@klh.edu.in).");
      return;
    }

    authStore.set({
      id: crypto.randomUUID(),
      name,
      email,
      role: "student",
      rollNumber: digitsOnly,
      department: "Computer Science & Engineering",
      year: "3rd Year",
      section: "A"
    });
    localStorage.setItem("kortex_token", "demo-token");
    nav("/student", { replace: true });
  }

  return (
    <AuthLayout>
      <form onSubmit={submit} className="w-full max-w-md">
        <p className="eyebrow">Create account</p>
        <h2 className="mt-2 text-3xl font-bold">Join Kortex</h2>
        <p className="mt-2 text-sm text-slate-500">Create your student portal account.</p>
        <div className="mt-8 space-y-4">
          <input
            className="input"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div>
            <input
              className="input"
              placeholder="2420080001@klh.edu.in"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-400">
              Student email prefix accepts numbers only (e.g. 2420080001@klh.edu.in)
            </p>
          </div>
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button className="btn-primary w-full">Create account</button>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered?{" "}
          <button type="button" onClick={() => nav("/login")} className="font-semibold text-slate-900">
            Sign in
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}