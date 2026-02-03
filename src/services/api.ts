

import axios from "axios"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// ✅ REQUEST INTERCEPTOR (auth token)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token")
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ RESPONSE INTERCEPTOR (🔥 MAIN FIX HERE)
api.interceptors.response.use(
  //  (response) => response.data, ✅ IMPORTANT: unwrap data
     (response) => response,
  (error) => {
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong"

    return Promise.reject(new Error(message))
  }
)

export type ApiClient = typeof api

