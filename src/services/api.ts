const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiOptions extends RequestInit {
  /** Relative path, e.g. `/login` */
  path: string;
  method?: HttpMethod;
}

async function apiRequest<TResponse = unknown, TBody = unknown>({
  path,
  method = "POST",
  headers,
  body,
  ...rest
}: ApiOptions & { body?: TBody }): Promise<TResponse> {
  const url = `${API_BASE_URL}${path}`;

  const init: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
    ...rest,
  };

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (error) {
    // Handle network errors, CORS issues, or connection failures
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Network error occurred. Please check your connection and try again.";
    
    // Provide more specific error messages for common issues
    if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
      throw new Error(
        "Unable to connect to the server. Please ensure the API server is running and accessible."
      );
    }
    
    throw new Error(errorMessage);
  }

  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const data = await res.json();
      message =
        data?.detail ||
        data?.message ||
        data?.error ||
        (typeof data === "string" ? data : message);
    } catch {
      // ignore JSON parse errors and use default message
    }
    throw new Error(message);
  }

  // Try to parse JSON, but allow empty responses
  try {
    return (await res.json()) as TResponse;
  } catch {
    return undefined as unknown as TResponse;
  }
}

export const api = {
  post: <TResponse = unknown, TBody = unknown>(
    path: string,
    body: TBody,
    init?: Omit<ApiOptions, "path" | "method" | "body">
  ) => apiRequest<TResponse, TBody>({ path, method: "POST", body, ...(init || {}) }),
};

export type ApiClient = typeof api;


