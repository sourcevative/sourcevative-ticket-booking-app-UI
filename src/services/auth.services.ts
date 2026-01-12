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

export interface ResetPasswordPayload {
  accessToken: string;
  newPassword: string;
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
    api.post<{ status: string; user_id: string }>("/forgot-password", {
      login: payload.login,
    }),

  resetPassword: (payload: ResetPasswordPayload) =>
    api.post<{ status: string; message: string }>("/reset-password", {
      access_token: payload.accessToken,
      new_password: payload.newPassword,
    }),

  resetPasswordDirect: (payload: ResetPasswordDirectPayload) =>
    api.post<{ status: string; message: string }>("/reset-password-direct", {
      user_id: payload.user_id,
      new_password: payload.new_password,
    }),
};


