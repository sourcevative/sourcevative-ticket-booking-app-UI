"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !phone || !password) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setError("Enter a valid phone number (at least 10 digits)");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    console.log("Signup data:", { name, email, phone, password });
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/25 to-secondary/20 text-foreground">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-2">
          <div className="hidden flex-col justify-center space-y-4 rounded-2xl border border-border bg-card/70 p-8 shadow-xl backdrop-blur lg:flex">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary">
              Join the crew
            </span>
            <h1 className="text-3xl font-semibold leading-tight">
              Create your booking workspace
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Set up your account to start managing bookings with the same nature-inspired palette used throughout the app.
            </p>
            <div className="rounded-xl border border-dashed border-primary/40 bg-primary/10 p-4 text-sm text-primary">
              Tip: Use a strong password (6+ characters), a valid email, and phone number to get started quickly.
            </div>
          </div>

          <div className="flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card/80 p-8 shadow-2xl shadow-primary/10 backdrop-blur"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold">Create account</h2>
                <p className="text-sm text-muted-foreground">
                  Enter your details to get started
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <label className="block space-y-2 text-sm font-medium text-foreground">
                  <span>Name</span>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-lg border border-input bg-background/80 px-3 py-2 text-base shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>

                <label className="block space-y-2 text-sm font-medium text-foreground">
                  <span>Email</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-input bg-background/80 px-3 py-2 text-base shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                <label className="block space-y-2 text-sm font-medium text-foreground">
                  <span>Phone number</span>
                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    className="w-full rounded-lg border border-input bg-background/80 px-3 py-2 text-base shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>

                <label className="block space-y-2 text-sm font-medium text-foreground">
                  <span>Password</span>
                  <input
                    type="password"
                    placeholder="Create a password"
                    className="w-full rounded-lg border border-input bg-background/80 px-3 py-2 text-base shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              </div>

              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
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
                Create account
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
