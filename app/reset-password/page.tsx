

"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@/src/services/auth.services";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ CHANGE 1: token instead of user_id
  const token = searchParams.get("token");

  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirmPassword") || "");

    // ✅ CHANGE 2: validate token
    if (!token) {
      setError("Invalid or expired reset link. Please request a new one.");
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // ✅ CHANGE 3: correct API + payload
      await authService.resetPassword({
        token,
        new_password: password,
      });

      setStatus("Your password has been updated successfully.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid or expired reset link."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-emerald-50/80 to-emerald-100 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">

        {/* LEFT — DESKTOP ONLY (UNCHANGED UI) */}
        <div className="hidden md:flex rounded-3xl bg-white/80 border border-emerald-100 shadow-lg shadow-emerald-100/60 px-8 py-10 flex-col justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
              Secure reset
            </span>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-emerald-950">
                Set a new password
              </h2>
              <p className="text-sm leading-relaxed text-emerald-900/70">
                Use a unique password to keep your farm booking workspace safe
                for you and your family.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-900/80">
            <p className="font-semibold mb-1">Tip</p>
            <p>Combine letters, numbers and symbols for a stronger password.</p>
          </div>
        </div>

        {/* RIGHT — FORM (UNCHANGED UI) */}
        <div className="rounded-3xl bg-white shadow-xl shadow-emerald-200/60 border border-emerald-100 px-8 py-10">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-emerald-950">
                Update password
              </h1>
              <p className="text-xs text-emerald-900/70">
                Enter your new password to finish resetting
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label className="block text-xs font-medium text-emerald-900/80 mb-1.5">
                  New password
                </label>
                <input
                  name="password"
                  type={show ? "text" : "password"}
                  placeholder="Enter new password"
                  className="input pr-10 w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-9 text-emerald-500 hover:text-emerald-700"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <label className="block text-xs font-medium text-emerald-900/80 mb-1.5">
                  Confirm password
                </label>
                <input
                  name="confirmPassword"
                  type={confirmShow ? "text" : "password"}
                  placeholder="Re-enter new password"
                  className="input pr-10 w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setConfirmShow(!confirmShow)}
                  className="absolute right-3 top-9 text-emerald-500 hover:text-emerald-700"
                >
                  {confirmShow ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
                {loading ? "Updating password..." : "Update password"}
              </button>

              <p className="text-center text-xs text-emerald-900/70">
                Done here?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-emerald-800 hover:underline"
                >
                  Back to login
                </Link>
              </p>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}



