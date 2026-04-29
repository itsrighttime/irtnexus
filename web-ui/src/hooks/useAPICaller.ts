"use client";

import { apiCaller } from "@/core-ui";
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

type typeResponse<TData> = {
  code: number;
  status: string;
  uniqueCode: string;
  message: string;
  meta: Record<string, string>;
  data: TData | null;
};

interface UseAPICallerReturn<TData> {
  response: typeResponse<TData> | null;
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
  const [response, setResponse] = useState<typeResponse<TData> | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const rawResponse = await apiCaller({
      endpoint,
      method,
      body,
      headers,
      params,
      printResult: false,
    });

    if ((rawResponse as any)?.error) {
      setResponse(null);
      setError((rawResponse as any).error);
    } else {
      setResponse(rawResponse.data as typeResponse<TData>);
      setError(null);
    }

    setLoading(false);
  }, [endpoint, method, body, headers, params]);

  useEffect(() => {
    if (!endpoint) return;
    fetchData();
  }, dependencies);

  const reset = () => {
    setResponse(null);
    setError(null);
    setLoading(false);
  };

  return {
    response,
    error,
    loading,
    refetch: fetchData,
    reset,
  };
};
