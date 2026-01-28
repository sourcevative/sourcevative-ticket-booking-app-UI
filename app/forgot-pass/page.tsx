

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/src/services/auth.services";

export default function ForgotPasswordPage() {
  const router = useRouter(); // unused but fine
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const login = String(form.get("login") || "").trim();

    if (!login) {
      setError("Please enter your email or phone number.");
      setLoading(false);
      return;
    }

    try {
      // ✅ ONLY API CALL – no redirect, no user_id
      await authService.forgotPassword({ login });

      // ✅ SAME UI, secure message
      setStatus(
        "If an account exists, a password reset link has been sent to your email."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-emerald-50/80 to-emerald-100 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">

        {/* LEFT — DESKTOP ONLY (PURANA UI, MOBILE HIDDEN) */}
        <div className="hidden md:flex rounded-3xl bg-white/80 border border-emerald-100 shadow-lg shadow-emerald-100/60 px-8 py-10 flex-col justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
              Reset access
            </span>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-emerald-950">
                Forgot your password?
              </h2>
              <p className="text-sm leading-relaxed text-emerald-900/70">
                Enter your email or phone number to verify your account and
                reset your password for your farm booking account.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-900/80">
            <p className="font-semibold mb-1">Note</p>
            <p>You can use either your registered email or phone number.</p>
          </div>
        </div>

        {/* RIGHT — FORM (UNCHANGED UI) */}
        <div className="rounded-3xl bg-white shadow-xl shadow-emerald-200/60 border border-emerald-100 px-8 py-10">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-emerald-950">
                Reset password
              </h1>
              <p className="text-xs text-emerald-900/70">
                Enter your email or phone number to verify
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-emerald-900/80 mb-1.5">
                Email or Phone
              </label>
              <input
                name="login"
                type="text"
                placeholder="you@example.com or +1234567890"
                className="input w-full"
                required
              />
              <p className="mt-1 text-[11px] text-emerald-900/70">
                Enter your registered email address or phone number.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {status && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="text-sm text-emerald-700">{status}</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                disabled={loading}
                className="w-full rounded-full bg-emerald-700 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-700/30 transition hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-700/40 disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify and Continue"}
              </button>

              <p className="text-center text-xs text-emerald-900/70">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-emerald-800 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

