
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@/src/services/auth.services";

export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const password = String(form.get("password") || "");

    try {
      const payload: any = { password };
      if (email) payload.email = email;
      else if (phone) payload.phone = phone;

      const res: any = await authService.login(payload);

      const role = Number(res?.user?.role);
      if (role !== 1 && role !== 2) {
        throw new Error("Invalid role received from backend");
      }

      document.cookie = `token=${res.access_token}; path=/`;
      document.cookie = `role=${role}; path=/`;

      localStorage.setItem("token", res.access_token);
      localStorage.setItem("role", String(role));

      if (res.user?.id) localStorage.setItem("user_id", String(res.user.id));
      if (res.user?.name) localStorage.setItem("user_name", String(res.user.name));
      if (res.user?.email) localStorage.setItem("user_email", String(res.user.email));

      if (role === 1) router.replace("/admin");
      else router.replace("/");

    } catch (err: any) {
      const msg = String(err?.message || "").toLowerCase();

      if (msg.includes("verify")) {
        setError("Please verify your email before logging in.");
      } else if (msg.includes("invalid")) {
        setError("Invalid email / phone number or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-emerald-50/80 to-emerald-100 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">

        {/* LEFT — DESKTOP ONLY (FIXED) */}
        <div className="hidden md:flex flex-col rounded-3xl bg-white/80 border border-emerald-100 shadow-lg px-10 py-12 justify-center">
          <div className="space-y-6">
            <span className="inline-flex w-fit rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
              Welcome back
            </span>

            <h2 className="text-4xl font-bold text-emerald-950 leading-tight">
              Sign in to your booking workspace
            </h2>

            <p className="text-emerald-900/70 max-w-sm">
              Access your bookings and manage your account.
            </p>
          </div>
        </div>

        {/* RIGHT — LOGIN FORM (UNCHANGED LOGIC) */}
        <div className="rounded-3xl bg-white shadow-xl border px-8 py-10">
          <form onSubmit={onSubmit} className="space-y-6">
            <h1 className="text-2xl font-semibold text-emerald-950">Login</h1>

            <input
              name="email"
              placeholder="Email"
              className="input w-full"
            />

            <input
              name="phone"
              placeholder="Phone"
              className="input w-full"
            />

            <div className="relative">
              <input
                name="password"
                type={show ? "text" : "password"}
                placeholder="Password"
                className="input pr-10 w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-2.5"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <Link
                href="/forgot-pass"
                className="text-xs font-medium text-emerald-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-emerald-700 text-white py-2.5 rounded-full"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="text-xs text-center">
              New here?{" "}
              <Link href="/signup" className="text-emerald-700 font-semibold">
                Create account
              </Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}



