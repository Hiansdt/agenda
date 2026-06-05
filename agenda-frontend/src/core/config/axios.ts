import axios from "axios";

import {
  type ApiErrorResponse,
  ApiRequestError,
  INTERNAL_SERVER_ERROR_MESSAGE,
} from "@/core/infra/api/ApiRequestError";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    const responseData = axios.isAxiosError(error)
      ? (error.response?.data as ApiErrorResponse | undefined)
      : undefined;
    const responseError =
      typeof responseData?.error === "string" ? responseData.error : undefined;
    const responseCode =
      typeof responseData?.code === "string" ? responseData.code : undefined;
    const message =
      status === 500
        ? INTERNAL_SERVER_ERROR_MESSAGE
        : responseError || (error instanceof Error ? error.message : undefined);

    if (
      typeof window !== "undefined" &&
      status === 401 &&
      window.location.pathname !== "/login"
    ) {
      window.location.assign("/login");
    }

    return Promise.reject(new ApiRequestError(message ?? "", status, responseCode));
  },
);
