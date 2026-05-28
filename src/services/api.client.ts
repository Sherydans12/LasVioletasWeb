import type { ApiResponse } from "@/types";

const API_BASE_URL = process.env.API_BASE_URL ?? "";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  revalidate?: number | false;
  tags?: string[];
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    headers = {},
    revalidate = 3600,
    tags,
  } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    next: {
      revalidate,
      ...(tags ? { tags } : {}),
    },
  };

  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      return { data: null, error: text, status: res.status };
    }
    const data = (await res.json()) as T;
    return { data, error: null, status: res.status };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { data: null, error: message, status: 0 };
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, "method">) =>
    request<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, "method">) =>
    request<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, "method">) =>
    request<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
