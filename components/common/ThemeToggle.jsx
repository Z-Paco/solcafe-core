"use client";
import React, { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "solcafe-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";
const THEME_COLOR = { light: "#edf1ea", dark: "#0c1613" };
// Day is sunlit stone; Vespers is the evening office, glass lit in the dark.
const THEME_NAME = { light: "Day", dark: "Vespers" };

// The effective theme: an explicit data-theme wins, otherwise the system preference.
function getTheme() {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function subscribe(onChange) {
  const media = window.matchMedia(DARK_QUERY);
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  media.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onChange);
  };
}

export default function ThemeToggle() {
  // null on the server so markup matches before hydration
  const theme = useSyncExternalStore(subscribe, getTheme, () => null);
  const next = theme === "dark" ? "light" : "dark";
  const pathname = usePathname();

  // Keep the browser UI colour in step with the chosen theme. The layout
  // renders one <meta name="theme-color"> per colour scheme; once the visitor
  // has a theme, every one of them gets that theme's colour.
  useEffect(() => {
    if (!theme) return;
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute("content", THEME_COLOR[theme]));
  }, [theme, pathname]);

  function toggle() {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage unavailable (private mode); the choice lasts for this page only
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme ? `Switch to ${THEME_NAME[next]} (${next} theme)` : "Toggle colour theme"}
      title={theme ? `Switch to ${THEME_NAME[next]}` : "Toggle colour theme"}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}
