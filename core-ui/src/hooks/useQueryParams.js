"use client";
import { useCallback } from "react";
export const useQueryParams = ({ navigate, location, }) => {
    const { search, pathname } = location;
    const query = new URLSearchParams(search);
    const getParam = useCallback((key) => query.get(key), [search]);
    const hasParam = useCallback((key) => query.has(key), [search]);
    const setParam = useCallback((key, value, options = { replace: true }) => {
        const updatedQuery = new URLSearchParams(search);
        updatedQuery.set(key, value.trim());
        navigate(`${pathname}?${updatedQuery.toString()}`, options);
    }, [navigate, pathname, search]);
    const setParams = useCallback((newParams = {}, options = { replace: true }) => {
        const updatedQuery = new URLSearchParams();
        Object.entries(newParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                updatedQuery.set(key, String(value).trim());
            }
        });
        navigate(`${pathname}?${updatedQuery.toString()}`, options);
    }, [navigate, pathname]);
    const deleteParam = useCallback((key, options = { replace: true }) => {
        const updatedQuery = new URLSearchParams(search);
        updatedQuery.delete(key);
        navigate(`${pathname}?${updatedQuery.toString()}`, options);
    }, [navigate, pathname, search]);
    const replaceParams = useCallback((paramsObj = {}, options = { replace: true }) => {
        const newQuery = new URLSearchParams();
        Object.entries(paramsObj).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                newQuery.set(key, String(value).trim());
            }
        });
        navigate(`${pathname}?${newQuery.toString()}`, options);
    }, [navigate, pathname]);
    const toggleParam = useCallback((key, options = { replace: true }) => {
        const updatedQuery = new URLSearchParams(search);
        const current = updatedQuery.get(key);
        const newValue = current === "true" ? "false" : "true";
        updatedQuery.set(key, newValue);
        navigate(`${pathname}?${updatedQuery.toString()}`, options);
    }, [navigate, pathname, search]);
    const appendParam = useCallback((key, value, options = { replace: true }) => {
        const updatedQuery = new URLSearchParams(search);
        const existing = updatedQuery.get(key);
        const values = existing ? existing.split(",") : [];
        const trimmed = value.trim();
        if (!values.includes(trimmed)) {
            values.push(trimmed);
            updatedQuery.set(key, values.join(","));
            navigate(`${pathname}?${updatedQuery.toString()}`, options);
        }
    }, [navigate, pathname, search]);
    const clearAllParams = useCallback((options = { replace: true }) => {
        navigate(pathname, options);
    }, [navigate, pathname]);
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
