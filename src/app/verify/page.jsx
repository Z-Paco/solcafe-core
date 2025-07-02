"use client";

import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "../styles/auth.css";

export default function VerifyPage() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [resendStatus, setResendStatus] = useState(null);

  useEffect(() => {
    async function handleVerification() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setVerificationStatus("error");
          return;
        }

        if (data?.session) {
          setVerificationStatus("success");
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          setVerificationStatus("error");
        }
      } catch (err) {
        setVerificationStatus("error");
      }
    }

    handleVerification();
  }, [router, supabase.auth, searchParams]);

  // Handler for resending verification email
  const handleResend = async () => {
    setResendStatus("sending");
    // Try to get the email from the session or search params
    let email = null;
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user?.email) {
      email = data.session.user.email;
    } else {
      // fallback: try to get from search params
      email = searchParams.get("email");
    }
    if (!email) {
      setResendStatus("error");
      return;
    }
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    if (error) {
      setResendStatus("error");
    } else {
      setResendStatus("sent");
    }
  };

  return (
    <main className="auth-container solarpunk-bg">
      <div className="auth-card">
        <div className="auth-confirmation">
          {verificationStatus === "verifying" && (
            <>
              <div className="loading-icon">⟳</div>
              <h2>Verifying Your Account</h2>
              <p>Please wait while we verify your email address...</p>
            </>
          )}

          {verificationStatus === "success" && (
            <>
              <div className="confirmation-icon">✦</div>
              <h2>Verification Successful</h2>
              <p>
                Your email has been verified. You'll be redirected to the home
                page shortly.
              </p>
              <Link href="/" className="auth-button">
                Go to Home Page
              </Link>
            </>
          )}

          {verificationStatus === "error" && (
            <>
              <div className="error-icon">!</div>
              <h2>Verification Failed</h2>
              <p>
                There was an issue verifying your email. The link may have
                expired.
              </p>
              <button
                className="auth-button"
                onClick={handleResend}
                disabled={resendStatus === "sending"}
                style={{ marginBottom: "0.5rem" }}
              >
                {resendStatus === "sending"
                  ? "Resending..."
                  : "Resend Verification Email"}
              </button>
              {resendStatus === "sent" && (
                <div className="form-helper" style={{ color: "green" }}>
                  Verification email sent! Please check your inbox.
                </div>
              )}
              {resendStatus === "error" && (
                <div className="form-helper" style={{ color: "red" }}>
                  Could not resend email. Please try again or contact support.
                </div>
              )}
              <Link href="/login" className="auth-button">
                Return to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
