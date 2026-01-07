"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contact) {
      setError("Email or phone is required");
      setSuccess("");
      return;
    }

    const isEmail = contact.includes("@");
    const phoneDigits = contact.replace(/\D/g, "");
    const isPhone = phoneDigits.length >= 10;

    if (!isEmail && !isPhone) {
      setError("Enter a valid email or phone number");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("Password reset link sent to your email or phone");

    console.log("Forgot password contact:", contact);
    // later → API call
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/25 to-secondary/20 text-foreground">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-2">
          <div className="hidden flex-col justify-center space-y-4 rounded-2xl border border-border bg-card/70 p-8 shadow-xl backdrop-blur lg:flex">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary">
              Reset password
            </span>
            <h1 className="text-3xl font-semibold leading-tight">
              Recover your account access
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enter your email or phone number and we'll send you a link to reset your password and get back into your booking workspace.
            </p>
            <div className="rounded-xl border border-dashed border-primary/40 bg-primary/10 p-4 text-sm text-primary">
              Tip: Check your email inbox or SMS messages for the reset link. It may take a few minutes to arrive.
            </div>
          </div>

          <div className="flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card/80 p-8 shadow-2xl shadow-primary/10 backdrop-blur"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold">Forgot Password</h2>
                <p className="text-sm text-muted-foreground">
                  Enter your email or phone to receive a reset link
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              {success && (
                <div className="space-y-3">
                  <div className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary">
                    {success}
                  </div>
                  <Link
                    href="/reset-password"
                    className="block w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/30"
                  >
                    Go to Reset Password
                  </Link>
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
              </div>

              <div className="text-sm text-center text-muted-foreground">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary transition hover:text-primary/80"
                >
                  Login
                </Link>
              </div>

              {!success && (
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/30"
                >
                  Send Reset Link
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
