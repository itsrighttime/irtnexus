"use client";
import { apiCaller } from "@/utils";
import { useState, useEffect, useCallback } from "react";
export const useAPICaller = ({ endpoint = "/", method = "GET", body = null, headers = {}, params = {}, dependencies = [], }) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
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
        if (response?.error) {
            setData(null);
            setError(response.error);
        }
        else {
            setData(response);
            setError(null);
        }
        setLoading(false);
    }, [endpoint, method, body, headers, params]);
    useEffect(() => {
        if (!endpoint)
            return;
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
