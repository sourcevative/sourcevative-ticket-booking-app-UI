

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

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const password = String(form.get("password") || "");

    try {
      const cleanedPhone = phone.replace(/\D/g, "");

      await authService.signup({
        name,
        email,
        phone: cleanedPhone,
        password,
      });

      setSuccess(true);

      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-emerald-50/80 to-emerald-100 px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">

        {/* LEFT — DESKTOP ONLY (PURANA UI, MOBILE REMOVED) */}
        <div className="hidden md:flex flex-col rounded-3xl bg-white/80 border border-emerald-100 shadow-lg px-10 py-12 justify-center">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
              Join the crew
            </span>

            <h2 className="text-4xl font-bold text-emerald-950 leading-tight">
              Create your booking workspace
            </h2>

            <p className="text-emerald-900/70 max-w-sm">
              Set up your account to start managing bookings.
            </p>
          </div>
        </div>

        {/* RIGHT — SIGNUP FORM (AS IT IS) */}
        <div className="rounded-3xl bg-white shadow-xl border px-8 py-10">
          <form onSubmit={onSubmit} className="space-y-6">
            <h1 className="text-2xl font-semibold">Create account</h1>

            <input
              name="name"
              placeholder="Your name"
              className="input w-full"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              className="input w-full"
              required
            />

            <input
              name="phone"
              placeholder="Phone number"
              className="input w-full"
              required
            />

            <div className="relative">
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
                className="absolute right-3 top-2.5"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {success && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm text-green-600">
                  Account created. Redirecting…
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-emerald-700 text-white py-2.5 rounded-full"
            >
              {loading ? "Creating..." : "Create account"}
            </button>

            <p className="text-center text-xs">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-emerald-800">
                Login
              </Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}
