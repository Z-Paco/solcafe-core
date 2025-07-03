"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../styles/auth.css";

export default function SignUpPage() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [initialRole, setInitialRole] = useState("Dreamer");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (session) router.push("/");
  }, [session, router]);

  async function handleSignUp(e) {
    e.preventDefault();
    setError(null);

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            primary_role: initialRole,
            role_level: 1,
          },
        },
      });

      if (error) {
        // Custom message for disabled signups
        if (
          error.message &&
          (error.message.toLowerCase().includes("signups not allowed") ||
            error.message.toLowerCase().includes("signups are disabled"))
        ) {
          setError("Signups are currently disabled. Please check back soon.");
        } else {
          setError(error.message);
        }
      } else {
        setShowConfirmation(true);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Base roles available at signup
  const availableRoles = ["Dreamer", "Techie", "Book Keeper"];

  // Role descriptions to help users choose
  const roleDescriptions = {
    Dreamer:
      "Visionaries who imagine possibilities and create art that inspires the community.",

    Techie:
      "Builders who design systems and craft solutions for a sustainable future.",

    "Book Keeper":
      "Observers and curators who preserve knowledge and weave the collective narrative.",
  };

  return (
    <main className="auth-container solarpunk-bg">
      <div className="auth-card">
        {showConfirmation ? (
          <div className="auth-confirmation">
            <div className="confirmation-icon">✦</div>
            <h2>Your Journey Begins</h2>
            <p>
              Check your email to confirm your account and join the solarpunk
              collective.
            </p>
            <Link href="/login" className="auth-button">
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="auth-header">
              <h1>Join Solcafe</h1>
              <p>Begin your journey toward a brighter, collaborative future</p>
            </div>

            <form onSubmit={handleSignUp} className="auth-form">
              <div className="form-group">
                <label htmlFor="displayName">1. Display Name</label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="solarpunk-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">2. Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="solarpunk-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">3. Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="solarpunk-input"
                />
                <small className="form-helper">
                  Must be at least 8 characters
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">4. Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="solarpunk-input"
                />
              </div>

              <div className="form-group role-selection-container">
                <label htmlFor="initialRole">5. Choose Your Initial Path</label>
                <div className="role-options">
                  {availableRoles.map((role) => (
                    <div
                      key={role}
                      className={`role-option ${
                        initialRole === role ? "selected" : ""
                      }`}
                      onClick={() => setInitialRole(role)}
                    >
                      <div className="role-icon">{role.charAt(0)}</div>
                      <div className="role-details">
                        <h4>{role}</h4>
                        <p>
                          {roleDescriptions[role] || "No description available"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <small className="form-helper">
                  Your role will evolve as you contribute
                </small>
                <div style={{ marginTop: "0.5rem" }}>
                  <Link href="/about/roles" className="learn-roles-link">
                    Learn about roles
                  </Link>
                </div>
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button
                type="submit"
                className="auth-button journey-button"
                disabled={isLoading}
              >
                {isLoading ? "Creating Your Path..." : "Begin Your Journey"}
              </button>
            </form>

            <div className="auth-links">
              <Link href="/login">Already have an account? Log in.</Link>
              <small className="terms-text">
                By joining, you agree to our <Link href="/terms">Terms</Link>{" "}
                and <Link href="/privacy">Privacy Policy</Link>
              </small>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
