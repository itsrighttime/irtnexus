// utils/api/apiCaller.js
import axios from "axios";

export const apiCaller = async ({
  endpoint = "/",
  method = "GET",
  body = null,
  headers = {},
  params = {},
  timeout = 10000,
  printResult = false,
}) => {
  try {
    const response = await axios({
      url: endpoint,
      method,
      data: body,
      headers,
      params,
      timeout,
      withCredentials: true,
    });

    const data = response.data;

    if (printResult === true)
      console.log(`API Response of endpoint (${endpoint}): `, data);

    return data;
  } catch (error) {
    console.error(`API Response of endpoint (${endpoint}): `, data);

    return {
      message: error.message,
      data: error.response.data,
      success: false,
      status: error.status,
    };
  }
};
