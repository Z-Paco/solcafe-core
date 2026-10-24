"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ThemeToggle from "./ThemeToggle";
import CopySlot from "./CopySlot";
import RoseWindow from "../glass/RoseWindow";
import "../../app/styles/header.css";

const NAV = [
  { href: "/news", label: "News" },
  { href: "/art", label: "Art" },
  { href: "/engineer", label: "Engineering" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [supabase] = useState(() => createClient());
  const [session, setSession] = useState(null);
  const [avatar, setAvatar] = useState("/profiles/default-avatar.jpg");
  // The menu is open only for the route it was opened on, so navigating
  // closes it without an effect.
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState(null);
  const menuOpen = openFor === pathname;
  const setMenuOpen = (open) => setOpenFor(open ? pathname : null);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!session?.user?.id) return;
    supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => {
        if (data?.avatar_url) {
          setAvatar(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${data.avatar_url}`
          );
        }
      });
  }, [session, supabase]);

  // Escape closes the menu and returns focus to its button; a click outside
  // or tabbing out of the header closes it too.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpenFor(null);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpenFor(null);
    };
    const onFocusIn = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpenFor(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [menuOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/"; // refresh and redirect
  }

  const links = session
    ? [...NAV, { href: "/dashboard", label: "Dashboard" }]
    : NAV;

  const isCurrent = (href) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="site-header__inner container">
        <div className="site-header__brand">
          <Link href="/" className="site-header__home" aria-label="SolCafe home">
            <RoseWindow variant="mark" className="site-header__mark" />
            <span className="site-header__wordmark">SolCafe</span>
          </Link>
          <CopySlot id="header.tagline" as="span" size="small" label="Tagline" className="site-header__tagline" />
        </div>

        <nav
          id="site-nav"
          className={`site-nav${menuOpen ? " site-nav--open" : ""}`}
          aria-label="Main"
        >
          <ul className="site-nav__list">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="site-nav__link"
                  aria-current={isCurrent(href) ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {session && (
            <div className="site-nav__account">
              <Link href="/profile" className="site-nav__avatar" aria-label="Your profile">
                <Image src={avatar} alt="" width={32} height={32} className="site-nav__avatar-img" />
              </Link>
              <button type="button" onClick={handleLogout} className="site-nav__logout">
                Log out
              </button>
            </div>
          )}
        </nav>

        <div className="site-header__tools">
          <ThemeToggle />
          <button
            type="button"
            className="site-header__menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            ref={toggleRef}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
