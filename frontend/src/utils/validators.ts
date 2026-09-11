export const required = (value: string) => value.trim().length > 0;
export const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const validStudentEmail = (value: string) => /^\d+@klh\.edu\.in$/.test(value);
export const minLength = (value: string, length: number) => value.trim().length >= length;

export function validateLogin(email: string, password: string, role: string = "student") {
  const errors: Record<string, string> = {};
  if (!validEmail(email)) {
    errors.email = "Enter a valid email address.";
  } else if (role === "student" && !validStudentEmail(email)) {
    errors.email = "Student email must be digits followed by @klh.edu.in (e.g. 2420080001@klh.edu.in).";
  }
  if (!minLength(password, 4)) errors.password = "Password must be at least 4 characters.";
  return errors;
}