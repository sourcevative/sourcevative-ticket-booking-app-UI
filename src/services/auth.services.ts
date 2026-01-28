
import { api } from "./api";

export interface SignupPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
}


export interface ForgotPasswordPayload {
  login: string; // email OR phone
}

// ✅ FIXED
export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface ResetPasswordDirectPayload {
  user_id: string;
  new_password: string;
}

export const authService = {
  signup: (payload: SignupPayload) =>
    api.post<{ status: string; message: string; user_id: string }>("/signup", {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
    }),

  login: (payload: LoginPayload) => {
    const login = payload.email?.trim() || payload.phone?.trim() || "";
    if (!login) {
      throw new Error("Please enter either your email or phone number.");
    }

    return api.post<{
      status: string;
      access_token: string;
      user: unknown;
    }>("/login", {
      login,
      password: payload.password,
    });
  },

  forgotPassword: (payload: ForgotPasswordPayload) =>
    api.post<{ status: string; message: string }>("/forgot-password", {
      login: payload.login,
    }),

  // ✅ CORRECT RESET (token based)
  resetPassword: (payload: ResetPasswordPayload) =>
    api.post<{ status: string; message: string }>("/reset-password", {
      token: payload.token,
      new_password: payload.new_password,
    }),

  // ❌ KEEP but DO NOT USE in UI
  resetPasswordDirect: (payload: ResetPasswordDirectPayload) =>
    api.post<{ status: string; message: string }>("/reset-password-direct", {
      user_id: payload.user_id,
      new_password: payload.new_password,
    }),
};
