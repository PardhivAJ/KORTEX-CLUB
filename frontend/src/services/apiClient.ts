const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const USE_MOCK = String(import.meta.env.VITE_USE_MOCK_API ?? "true") !== "false";

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("kortex_token");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10000);
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    signal: options.signal || controller.signal,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw new Error("The request timed out. Try again.");
    throw new Error("Unable to connect to the Kortex server. Try again.");
  } finally { window.clearTimeout(timeout); }
  if (!response.ok) {
    let message = `Request failed with ${response.status}`;
    try { const body = await response.json() as { error?: string }; message = body.error || message; } catch { /* non-JSON error */ }
    throw new Error(message);
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

export const isMockMode = USE_MOCK;
export const apiBaseUrl = BASE_URL;