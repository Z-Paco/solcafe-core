"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import "../../app/styles/header.css";

export default function Header() {
  const [supabase] = useState(() => createClient());
  const [session, setSession] = useState(null);
  const [avatar, setAvatar] = useState("/profiles/default-avatar.jpg");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", session.user.id)
          .single();

        if (data?.avatar_url) {
          setAvatar(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${data.avatar_url}`
          );
        }
      };

      fetchProfile();
    }
  }, [session, supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/"; // refresh and redirect
  }

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="site-title">
          <Link href="/" className="site-title-link">
            <h1>Solcafe</h1>
          </Link>
          <h3>Solar Punk Inspired</h3>
        </div>

        <nav className="main-nav">
          <ul className="nav-links">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </nav>

        <div className="user-controls">
          {session ? (
            <>
              <button onClick={handleLogout} className="logout-button">
                Log Out
              </button>
              <Link href="/profile" className="profile-link">
                <Image
                  src={avatar}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="avatar-thumbnail"
                />
              </Link>
            </>
          ) : (
            <Link href="/login" className="login-button">
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
