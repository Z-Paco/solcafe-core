"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../styles/dashboard.css";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!session) return;

      try {
        const { data, error } = await supabase
          .from("profiles") // Change this if your table has a different name
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [session, supabase]);

  useEffect(() => {
    // If not logged in, redirect to login
    if (!session) {
      router.push("/login?redirect=/dashboard");
      return;
    }
    // If not verified, redirect to verify page
    if (!session.user.email_confirmed_at) {
      router.push("/verify");
    }
  }, [session, router]);

  // Loading state
  if (!session || loading) {
    return <div className="loading-container">Loading your dashboard...</div>;
  }

  // Get display name or fall back to email
  const displayName =
    profile?.display_name || profile?.username || session.user.email;

  return (
    <main className="dashboard-content">
      <h1>Dashboard</h1>
      <section className="dashboard-welcome">
        <h2>Welcome back, {displayName}!</h2>
        <p>Here's a quick overview of your activity and shortcuts to get started.</p>
      </section>

      <section className="dashboard-actions">
        <h3>Quick Actions</h3>
        <ul>
          <li>
            <Link href="/art">View Your Art Posts</Link>
          </li>
          <li>
            <Link href="/engineer">View your Engineering Projects</Link>
          </li>
          <li>
            <Link href="/news">Read Community News</Link>
          </li>
          <li>
            <Link href="/profile">Edit your Profile</Link>
          </li>
        </ul>
      </section>

      <section className="dashboard-summary">
        <h3>Your Recent Activity</h3>
        {profile?.role && (
          <p>
            Your role:{" "}
            <span className="highlight-bg">{profile.role}</span>
          </p>
        )}
        <p>(Recent posts, comments, or stats will appear here.)</p>
      </section>
    </main>
  );
}
