import { useState } from "react";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  fetchData: (endpoint: string, method?: RequestMethod, payload?: Record<string, unknown>) => Promise<void>;
}

export function useApi<T = unknown>(): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (endpoint: string, method: RequestMethod = "GET", payload?: Record<string, unknown>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: method !== "GET" ? JSON.stringify(payload) : undefined,
      });

      const result: T = await response.json();

      if (!response.ok) {
        throw new Error((result as { error?: string }).error || "Something went wrong");
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fetchData };
}
