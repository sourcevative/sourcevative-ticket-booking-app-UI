// import axios from "axios"

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// })

// // <<<<<<< HEAD
// interface ApiOptions extends RequestInit {
//   path: string;
//   method?: HttpMethod;
// }

// async function apiRequest<TResponse = unknown, TBody = unknown>({
//   path,
//   method = "POST",
//   headers,
//   body,
//   ...rest
// }: ApiOptions & { body?: TBody }): Promise<TResponse> {
//   const url = `${API_BASE_URL}${path}`;

//   // ✅ CORRECT INIT (credentials REMOVED)
//   const init: RequestInit = {
//     method,
//     headers: {
//       "Content-Type": "application/json",
//       ...(headers || {}),
//     },
//     body: body !== undefined ? JSON.stringify(body) : undefined,
//     ...rest,
//   };

//   if (process.env.NODE_ENV === "development") {
//     console.log(`API Request [${method}]`, { url, body });
//   }

//   let res: Response;
//   try {
//     res = await fetch(url, init);
//   } catch (error) {
//     const message =
//       error instanceof Error
//         ? error.message
//         : "Network error. Please check your connection.";

//     throw new Error(
//       message.includes("Failed to fetch")
//         ? "Unable to connect to server. Is backend running on port 8000?"
//         : message
//     );
//   }

//   if (!res.ok) {
//     let message = "Something went wrong. Please try again.";

//     try {
//       const text = await res.text();

//       if (text) {
//         try {
//           const data = JSON.parse(text);

//           if (Array.isArray(data?.detail)) {
//             message = data.detail
//               .map((e: any) => e?.msg || "Validation error")
//               .join(", ");
//           } else {
//             message =
//               data?.detail ||
//               data?.message ||
//               data?.error ||
//               message;
//           }
//         } catch {
//           message = text;
//         }
//       } else {
//         if (res.status === 400) message = "Invalid request data.";
//         if (res.status === 401) message = "Invalid login credentials.";
//         if (res.status === 403) message = "Access denied.";
//         if (res.status === 500) message = "Server error. Try again later.";
//       }
//     } catch {
//       message = `Request failed with status ${res.status}`;
//     }

//     throw new Error(message);
//   }

//   try {
//     return (await res.json()) as TResponse;
//   } catch {
//     return undefined as TResponse;
//   }
// }

// export const api = {
//   get: <TResponse = unknown>(
//     path: string,
//     init?: Omit<ApiOptions, "path" | "method">
//   ) =>
//     apiRequest<TResponse>({
//       path,
//       method: "GET",
//       ...(init || {}),
//     }),

//   post: <TResponse = unknown, TBody = unknown>(
//     path: string,
//     body: TBody,
//     init?: Omit<ApiOptions, "path" | "method" | "body">
//   ) =>
//     apiRequest<TResponse, TBody>({
//       path,
//       method: "POST",
//       body,
//       ...(init || {}),
//     }),

//   put: <TResponse = unknown, TBody = unknown>(
//     path: string,
//     body: TBody,
//     init?: Omit<ApiOptions, "path" | "method" | "body">
//   ) =>
//     apiRequest<TResponse, TBody>({
//       path,
//       method: "PUT",
//       body,
//       ...(init || {}),
//     }),

//   patch: <TResponse = unknown, TBody = unknown>(
//     path: string,
//     body: TBody,
//     init?: Omit<ApiOptions, "path" | "method" | "body">
//   ) =>
//     apiRequest<TResponse, TBody>({
//       path,
//       method: "PATCH",
//       body,
//       ...(init || {}),
//     }),

//   delete: <TResponse = unknown, TBody = unknown>(
//     path: string,
//     body?: TBody,
//     init?: Omit<ApiOptions, "path" | "method" | "body">
//   ) =>
//     apiRequest<TResponse, TBody>({
//       path,
//       method: "DELETE",
//       body,
//       ...(init || {}),
//     }),
// };

// export type ApiClient = typeof api;
// =======
// // ✅ REQUEST INTERCEPTOR
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token") // same key as login
//     if (token) {
//       config.headers = config.headers || {}
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )
//  >>>>>>> origin/main

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

