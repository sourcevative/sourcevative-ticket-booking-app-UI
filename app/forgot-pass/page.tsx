"use client";

import React from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("http://localhost:8000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: form.get("identifier") }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          data?.message ||
          data?.error ||
          "We could not send a reset link. Please try again.";
        throw new Error(message);
      }

      setStatus("If an account exists, a reset link has been emailed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-5 rounded-xl border border-gray-200 bg-white backdrop-blur-sm p-8 shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-gray-900 text-3xl font-bold">Reset Password</h1>
          <p className="text-gray-600 text-sm">Enter your email or phone to receive a reset link</p>
        </div>

        <div className="space-y-4">
          <input 
            name="identifier" 
            placeholder="Email or Phone" 
            className="input w-full" 
            required 
          />
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

        <button disabled={loading} className="btn-primary w-full py-3 text-base font-semibold">
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-center">
          <Link 
            href="/login" 
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
          >
            Remember your password? 
            <span className="text-blue-600 hover:text-blue-700 font-medium">Login here</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
