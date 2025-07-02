"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import Image from "next/image";
import "../app/styles/header.css";

export default function Header() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [avatar, setAvatar] = useState("/profiles/default-avatar.jpg");
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch profile data to get avatar and role_id
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("avatar_url, role_id")
          .eq("id", session.user.id)
          .single();

        if (data?.avatar_url) {
          setAvatar(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${data.avatar_url}`
          );
        }
        if (data?.role_id) {
          setRoleId(data.role_id);
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
              <Link href="/comm">Community &amp; Collab</Link>
            </li>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            {/* <li>
              <Link href="/references">References</Link>
            </li> */}
            <li>
              <Link href="/contact">Contact</Link>
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
              {roleId === 4 && <span className="admin-badge">Admin</span>}
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
