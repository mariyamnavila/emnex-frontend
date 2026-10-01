const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

// Every backend response looks like this
export type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Error thrown when the API returns a failure.
// Must stay a class (we check with `error instanceof ApiError`).
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

const request = async <T>(
  path: string,
  method: string,
  body?: unknown,
): Promise<ApiEnvelope<T>> => {
  // 1. Network failure (backend not running, CORS blocked, ...)
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Cannot reach the server. Is the backend running on port 5000?",
      0,
    );
  }

  // 2. Response body is not JSON (e.g. HTML error page)
  let json: ApiEnvelope<unknown> | null = null;
  try {
    json = (await response.json()) as ApiEnvelope<unknown>;
  } catch {
    json = null;
  }

  if (!json) {
    throw new ApiError(`Server error (HTTP ${response.status})`, response.status);
  }

  // 3. Backend reported a failure → show ITS message
  if (!response.ok || !json.success) {
    throw new ApiError(
      json.message || `Request failed (HTTP ${response.status})`,
      response.status,
    );
  }

  return json as ApiEnvelope<T>;
};

export const api = {
  get: <T>(path: string) => request<T>(path, "GET"),
  post: <T>(path: string, body?: unknown) => request<T>(path, "POST", body),
  patch: <T>(path: string, body?: unknown) => request<T>(path, "PATCH", body),
  delete: <T>(path: string) => request<T>(path, "DELETE"),
};
