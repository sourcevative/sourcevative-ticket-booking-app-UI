"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contact || !password) {
      setError("All fields are required");
      return;
    }

    const isEmail = contact.includes("@");
    const phoneDigits = contact.replace(/\D/g, "");
    const isPhone = phoneDigits.length >= 10;

    if (!isEmail && !isPhone) {
      setError("Enter a valid email or phone number");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    console.log("Login data:", { contact, password });
    setContact("");
    setPassword("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/25 to-secondary/20 text-foreground">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-2">
          <div className="hidden flex-col justify-center space-y-4 rounded-2xl border border-border bg-card/70 p-8 shadow-xl backdrop-blur lg:flex">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary">
              Welcome back
            </span>
            <h1 className="text-3xl font-semibold leading-tight">
              Login to your farm booking workspace
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Manage bookings, track schedules, and keep guests moving with a clean interface tuned to our nature-inspired palette.
            </p>
            <div className="rounded-xl border border-dashed border-primary/40 bg-primary/10 p-4 text-sm text-primary">
              Tip: Use your account email and a 6+ character password to access the dashboard.
            </div>
          </div>

          <div className="flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card/80 p-8 shadow-2xl shadow-primary/10 backdrop-blur"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold">Login</h2>
                <p className="text-sm text-muted-foreground">
                  Enter your details to continue
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <label className="block space-y-2 text-sm font-medium text-foreground">
                  <span>Email or phone</span>
                  <input
                    type="text"
                    placeholder="Email or phone"
                    className="w-full rounded-lg border border-input bg-background/80 px-3 py-2 text-base shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </label>

                <label className="block space-y-2 text-sm font-medium text-foreground">
                  <span>Password</span>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-input bg-background/80 px-3 py-2 text-base shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-primary transition hover:text-primary/80"
                >
                  Forgot password?
                </Link>
                <Link
                  href="/signup"
                  className="text-muted-foreground transition hover:text-primary"
                >
                  Create account
                </Link>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/30"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
