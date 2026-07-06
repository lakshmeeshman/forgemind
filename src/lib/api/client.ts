// client.ts
/**
 * ForgeMind Centralized API Client Wrapper
 * Ready for FastAPI integration.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Exported so service-layer modules (e.g. company.ts) can branch on mock
// vs. live mode themselves when a single apiClient() call isn't enough —
// e.g. to decide which identifier (slug vs. ticker) to query with.
export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false"; // Defaults to true during frontend prototyping

// Helper to simulate network latency
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit & { mockData?: T; useMock?: boolean }
): Promise<T> {
  const useMock = options?.useMock ?? USE_MOCK_API;

  if (useMock) {
    // Simulate natural API latency (800ms to 1500ms)
    await delay(800 + Math.random() * 700);

    // Simulated error injection for testing error UI boundary states
    if (endpoint.includes("error-state")) {
      throw new Error(
        "Connection timed out: Failed to reach ForgeMind synthesis worker pipeline. Please retry the scan."
      );
    }

    if (options?.mockData !== undefined) {
      return options.mockData;
    }

    throw new Error(`Developer Error: Mock data not supplied for endpoint: ${endpoint}`);
  }

  // Actual backend request ready for FastAPI integration
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = new Headers({
    "Content-Type": "application/json",
    ...(options?.headers || {}),
  });

  // Automatically attach auth token if available (Sprint 2 prep)
  const token = typeof window !== "undefined" ? localStorage.getItem("forgemind_token") : null;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Network-level failures (DNS, connection refused, CORS rejection, etc.)
  // throw a raw, cryptic TypeError from fetch() itself. Normalize that
  // into the same friendly Error shape callers already expect from the
  // HTTP-error branch below.
  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Network Error: Unable to reach the ForgeMind API. Please check your connection and try again."
    );
  }

  if (!response.ok) {
    let errorMessage = `API Error [${response.status}]`;
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.detail || errorJson.message || errorMessage;
    } catch {
      try {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      } catch { }
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}