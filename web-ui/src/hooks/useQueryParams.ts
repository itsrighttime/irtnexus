"use client";

import { useCallback } from "react";
import type { NavigateFunction, Location } from "react-router-dom";

type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
};

type ParamsObject = Record<
  string,
  string | number | boolean | null | undefined
>;

interface UseQueryParamsOptions {
  navigate: NavigateFunction;
  location: Location;
}

export const useQueryParams = ({
  navigate,
  location,
}: UseQueryParamsOptions) => {
  const { search, pathname } = location;
  const query = new URLSearchParams(search);

  const getParam = useCallback(
    (key: string): string | null => query.get(key),
    [search],
  );

  const hasParam = useCallback(
    (key: string): boolean => query.has(key),
    [search],
  );

  const setParam = useCallback(
    (
      key: string,
      value: string,
      options: NavigateOptions = { replace: true },
    ) => {
      const updatedQuery = new URLSearchParams(search);
      updatedQuery.set(key, value.trim());
      navigate(`${pathname}?${updatedQuery.toString()}`, options);
    },
    [navigate, pathname, search],
  );

  const setParams = useCallback(
    (
      newParams: ParamsObject = {},
      options: NavigateOptions = { replace: true },
    ) => {
      const updatedQuery = new URLSearchParams();

      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          updatedQuery.set(key, String(value).trim());
        }
      });

      navigate(`${pathname}?${updatedQuery.toString()}`, options);
    },
    [navigate, pathname],
  );

  const deleteParam = useCallback(
    (key: string, options: NavigateOptions = { replace: true }) => {
      const updatedQuery = new URLSearchParams(search);
      updatedQuery.delete(key);
      navigate(`${pathname}?${updatedQuery.toString()}`, options);
    },
    [navigate, pathname, search],
  );

  const replaceParams = useCallback(
    (
      paramsObj: ParamsObject = {},
      options: NavigateOptions = { replace: true },
    ) => {
      const newQuery = new URLSearchParams();

      Object.entries(paramsObj).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          newQuery.set(key, String(value).trim());
        }
      });

      navigate(`${pathname}?${newQuery.toString()}`, options);
    },
    [navigate, pathname],
  );

  const toggleParam = useCallback(
    (key: string, options: NavigateOptions = { replace: true }) => {
      const updatedQuery = new URLSearchParams(search);
      const current = updatedQuery.get(key);
      const newValue = current === "true" ? "false" : "true";
      updatedQuery.set(key, newValue);
      navigate(`${pathname}?${updatedQuery.toString()}`, options);
    },
    [navigate, pathname, search],
  );

  const appendParam = useCallback(
    (
      key: string,
      value: string,
      options: NavigateOptions = { replace: true },
    ) => {
      const updatedQuery = new URLSearchParams(search);
      const existing = updatedQuery.get(key);
      const values = existing ? existing.split(",") : [];

      const trimmed = value.trim();

      if (!values.includes(trimmed)) {
        values.push(trimmed);
        updatedQuery.set(key, values.join(","));
        navigate(`${pathname}?${updatedQuery.toString()}`, options);
      }
    },
    [navigate, pathname, search],
  );

  const clearAllParams = useCallback(
    (options: NavigateOptions = { replace: true }) => {
      navigate(pathname, options);
    },
    [navigate, pathname],
  );

  return {
    getParam,
    setParam,
    setParams,
    deleteParam,
    replaceParams,
    toggleParam,
    appendParam,
    clearAllParams,
    hasParam,
  };
};
