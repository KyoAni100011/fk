import axios from "axios";
import { ENV } from "../config/env";

export const api = axios.create({
  baseURL: ENV.API,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.data?.error) {
      error.response.data.message = typeof error.response.data.error === "string"
        ? error.response.data.error
        : "An error occurred";
    }
    return Promise.reject(error);
  },
);
