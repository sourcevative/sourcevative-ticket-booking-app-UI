"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@/src/services/auth.services";

export default function SignupPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      const name = String(form.get("name") || "").trim();
      const email = String(form.get("email") || "").trim();
      const phone = String(form.get("phone") || "").trim();
      const password = String(form.get("password") || "");

      await authService.signup({ name, email, phone, password });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-emerald-50/80 to-emerald-100 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-stretch">
        {/* Left info card */}
        <div className="rounded-3xl bg-white/80 border border-emerald-100 shadow-lg shadow-emerald-100/60 px-8 py-10 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
              Join the crew
            </span>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-emerald-950">
                Create your booking workspace
              </h2>
              <p className="text-sm leading-relaxed text-emerald-900/70">
                Set up your account to start managing farm visits, family outings,
                and school trips with our nature-inspired booking experience.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-900/80">
            <p className="font-semibold mb-1">Tip</p>
            <p>
              Use a strong password (6+ characters) and a valid email to get
              started quickly.
            </p>
          </div>
        </div>

        {/* Right form card */}
        <div className="rounded-3xl bg-white shadow-xl shadow-emerald-200/60 border border-emerald-100 px-8 py-10">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-emerald-950">
                Create account
              </h1>
              <p className="text-xs text-emerald-900/70">
                Enter your details to get started
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-emerald-900/80 mb-1.5">
                  Name
                </label>
                <input
                  name="name"
                  placeholder="Your name"
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-emerald-900/80 mb-1.5">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-emerald-900/80 mb-1.5">
                  Phone number
                </label>
                <input
                  name="phone"
                  placeholder="Phone number"
                  className="input w-full"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-xs font-medium text-emerald-900/80 mb-1.5">
                  Password
                </label>
                <input
                  name="password"
                  type={show ? "text" : "password"}
                  placeholder="Create a password"
                  className="input pr-10 w-full"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-9 text-emerald-500 hover:text-emerald-700 transition-colors"
                >
                  {show ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {success && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm text-green-600">Account created successfully</p>
              </div>
            )}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                disabled={loading}
                className="w-full rounded-full bg-emerald-700 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-700/30 transition hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-700/40 active:translate-y-px disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
              <p className="text-center text-xs text-emerald-900/70">
                Already have an account?{" "}
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
