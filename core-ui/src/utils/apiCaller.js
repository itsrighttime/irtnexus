import axios, { AxiosError } from "axios";
import { logger } from "./logger/logger.util";
/**
 * apiCaller
 *
 * Generic Axios-based API utility with structured logging.
 */
export const apiCaller = async ({ endpoint = "/", method = "GET", body = null, headers = {}, params = {}, timeout = 10000, printResult = false, }) => {
    try {
        logger.debug({
            message: `API Call → ${method} ${endpoint}`,
            context: { method, body, params, headers },
            code: "00002",
        });
        const axiosConfig = {
            url: endpoint,
            method,
            data: body,
            headers,
            params,
            timeout,
            withCredentials: true,
        };
        const response = await axios(axiosConfig);
        const data = response.data;
        logger.info({
            message: `API Success → ${method} ${endpoint}`,
            context: { status: response.status, data },
            code: "00003",
        });
        if (printResult === "true") {
            console.log(`API Response of endpoint (${endpoint}):`, data);
        }
        return { success: true, error: null, data, status: response.status };
    }
    catch (err) {
        const error = err;
        logger.error({
            message: `API Error → ${method} ${endpoint}`,
            context: { body, params, headers },
            code: "00004",
            error,
        });
        return {
            success: false,
            message: error.message,
            error,
            data: error.response?.data,
            status: error.response?.status,
        };
    }
};
