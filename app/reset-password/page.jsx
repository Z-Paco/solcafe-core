"use client";

import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import "../styles/auth.css";

export default function ResetPasswordPage() {
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleResetRequest(e) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-container solarpunk-bg">
      <div className="auth-card">
        {success ? (
          <div className="auth-confirmation">
            <div className="confirmation-icon">✦</div>
            <h2>Check Your Email</h2>
            <p>
              We've sent password reset instructions to {email}. Please check your inbox.
            </p>
            <Link href="/login" className="auth-button">
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="auth-header">
              <h1>Reset Password</h1>
              <p>Enter your email to receive password reset instructions</p>
            </div>

            <form onSubmit={handleResetRequest} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="solarpunk-input"
                />
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button
                type="submit"
                className="auth-button"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </button>
            </form>

            <div className="auth-links">
              <Link href="/login">Return to Login</Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
