"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      identifier: form.get("identifier"), // email or phone
      password: form.get("password"),
    };

    try {
      const res = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          data?.message ||
          data?.error ||
          "Signup failed. Please check your details and try again.";
        throw new Error(message);
      }

      router.push("/login");
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
          <h1 className="text-gray-900 text-3xl font-bold">Create Account</h1>
          <p className="text-gray-600 text-sm">Sign up to get started</p>
        </div>

        <div className="space-y-4">
          <input 
            name="name" 
            placeholder="Full Name" 
            className="input w-full" 
            required 
          />
          <input 
            name="identifier" 
            placeholder="Email or Phone" 
            className="input w-full" 
            type="email"
            required 
          />

          <div className="relative">
            <input
              name="password"
              type={show ? "text" : "password"}
              placeholder="Password"
              className="input pr-10 w-full"
              minLength={6}
              required
            />
            <button 
              type="button" 
              onClick={() => setShow(!show)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button disabled={loading} className="btn-primary w-full py-3 text-base font-semibold">
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <div className="text-center">
          <Link 
            href="/login" 
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
          >
            Already registered? 
            <span className="text-blue-600 hover:text-blue-700 font-medium">Login here</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
