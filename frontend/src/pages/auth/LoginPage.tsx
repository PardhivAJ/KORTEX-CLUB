import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import LoginForm from "../../components/forms/LoginForm";
import type { Role, User } from "../../types";
import { authStore } from "../../services/authStore";
import { login as loginWithApi } from "../../services/authService";
import { isMockMode } from "../../services/apiClient";

function demoUser(email: string, role: Role): User {
  const names: Record<Role, string> = { student: "A.J.Pardhiv", faculty: "Dr. Meera Rao", admin: "Kortex Administrator" };
  let finalEmail = email.trim();
  let rollNumber: string | undefined = undefined;

  if (role === "student") {
    const digitsOnly = finalEmail.split("@")[0].replace(/\D/g, "");
    rollNumber = digitsOnly || "2420080001";
    finalEmail = `${rollNumber}@klh.edu.in`;
  } else if (!finalEmail) {
    finalEmail = role === "faculty" ? "meera.rao@klh.edu.in" : "admin@klh.edu.in";
  }

  return {
    id: `${role}-demo`,
    name: role === "student" ? "A.J.Pardhiv" : names[role],
    email: finalEmail,
    role,
    rollNumber,
    department: role === "student" ? "AI&DS" : undefined,
    year: role === "student" ? "3rd Year" : undefined,
    section: role === "student" ? "Section 7" : undefined,
    cluster: role === "student" ? "Cluster 3" : undefined,
  };
}

export default function LoginPage() {
  const navigate = useNavigate();
  async function login(email: string, password: string, role: Role) { const user = isMockMode ? demoUser(email, role) : await loginWithApi(email, password); authStore.set(user); localStorage.setItem("kortex_token", isMockMode ? "demo-token" : localStorage.getItem("kortex_token") || ""); navigate(user.role === "student" ? "/student" : user.role === "faculty" ? "/faculty" : "/admin", { replace: true }); }
  return <AuthLayout><LoginForm onSubmit={login} /></AuthLayout>;
}