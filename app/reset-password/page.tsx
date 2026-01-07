"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      setSuccess("");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setSuccess("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("Password reset successfully! Redirecting to login...");
    console.log("Reset password:", { newPassword });
    
    // Clear fields after successful reset
    setNewPassword("");
    setConfirmPassword("");
    
    // In a real app, you would redirect to login after a delay
    // setTimeout(() => {
    //   window.location.href = "/login";
    // }, 2000);
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
              Set your new password
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Choose a strong password to secure your account. Make sure it's at least 6 characters long and use a combination of letters, numbers, and symbols for better security.
            </p>
            <div className="rounded-xl border border-dashed border-primary/40 bg-primary/10 p-4 text-sm text-primary">
              Tip: Use a unique password that you don't use elsewhere. Make sure both password fields match exactly.
            </div>
          </div>

          <div className="flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card/80 p-8 shadow-2xl shadow-primary/10 backdrop-blur"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold">Reset Password</h2>
                <p className="text-sm text-muted-foreground">
                  Enter your new password below
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <label className="block space-y-2 text-sm font-medium text-foreground">
                  <span>New password</span>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full rounded-lg border border-input bg-background/80 px-3 py-2 text-base shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </label>

                <label className="block space-y-2 text-sm font-medium text-foreground">
                  <span>Confirm password</span>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full rounded-lg border border-input bg-background/80 px-3 py-2 text-base shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/30"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

