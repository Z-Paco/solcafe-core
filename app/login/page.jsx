"use client";
import React from "react";
import { Suspense, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "../styles/auth.css";

// Only same-origin paths: "/write?type=news" is fine, "//evil.com" or "https://..." is not.
function safeRedirect(value) {
  if (typeof value !== "string" || !value.startsWith("/")) return "/";
  if (value.startsWith("//") || value.startsWith("/\\")) return "/";
  try {
    const url = new URL(value, "https://www.solcafe.ca");
    if (url.origin !== "https://www.solcafe.ca") return "/";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
}

function LoginForm() {
  const [supabase] = useState(() => createClient());
  const [session, setSession] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(
    searchParams.get("redirect") ?? searchParams.get("returnUrl")
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // if already logged in (or once sign-in succeeds), go to the requested page
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (session) router.push(redirectTo);
  }, [session, router, redirectTo]);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main id="main-content" className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue your solarpunk journey</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-links">
          <Link href="/reset-password">Forgot your password?</Link>
        </div>
      </div>
    </main>
  );
}

// useSearchParams needs a Suspense boundary for static prerendering.
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
