"use client";

import { apiCaller } from "@/utils";
import { useState, useEffect, useCallback } from "react";

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface UseAPICallerParams<TBody = unknown> {
  endpoint?: string;
  method?: HTTPMethod;
  body?: TBody | null;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  dependencies?: unknown[];
}

interface UseAPICallerReturn<TData> {
  data: TData | null;
  error: unknown;
  loading: boolean;
  refetch: () => Promise<void>;
  reset: () => void;
}

export const useAPICaller = <TData = unknown, TBody = unknown>({
  endpoint = "/",
  method = "GET",
  body = null,
  headers = {},
  params = {},
  dependencies = [],
}: UseAPICallerParams<TBody>): UseAPICallerReturn<TData> => {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await apiCaller({
      endpoint,
      method,
      body,
      headers,
      params,
    });

    if ((response as any)?.error) {
      setData(null);
      setError((response as any).error);
    } else {
      setData(response as TData);
      setError(null);
    }

    setLoading(false);
  }, [endpoint, method, body, headers, params]);

  useEffect(() => {
    if (!endpoint) return;
    fetchData();
  }, [fetchData, ...dependencies]);

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return {
    data,
    error,
    loading,
    refetch: fetchData,
    reset,
  };
};
