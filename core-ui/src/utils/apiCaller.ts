import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { UtilsLogger } from "./logger/logger.util.js";

const logger = UtilsLogger.logger;

interface APICallerOptions {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any | null;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  printResult?: boolean | "true";
}

interface APICallerSuccess<T = any> {
  success: true;
  error: null;
  data: T;
  status: number;
}

interface APICallerError {
  success: false;
  message: string;
  error?: any;
  data?: any;
  status?: number;
}

type APICallerResponse<T = any> = APICallerSuccess<T> | APICallerError;

/**
 * apiCaller
 *
 * Generic Axios-based API utility with structured logging.
 */
export const apiCaller = async <T = any>({
  endpoint = "/",
  method = "GET",
  body = null,
  headers = {},
  params = {},
  timeout = 10000,
  printResult = false,
}: APICallerOptions): Promise<APICallerResponse<T>> => {
  try {
    logger.debug({
      message: `API Call → ${method} ${endpoint}`,
      context: { method, body, params, headers },
      code: "00002",
    });

    const axiosConfig: AxiosRequestConfig = {
      url: endpoint,
      method,
      data: body,
      headers,
      params,
      timeout,
      withCredentials: true,
    };

    const response: AxiosResponse<T> = await axios(axiosConfig);
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
  } catch (err: any) {
    const error: AxiosError = err;
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
