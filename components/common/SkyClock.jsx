"use client";
import { useEffect } from "react";
import { getSkyPhase, isSkyPhase } from "@/lib/sky";

const FIVE_MINUTES = 5 * 60 * 1000;
const DEV = process.env.NODE_ENV !== "production";

// The server already rendered the right phase. This only keeps it current
// while the tab stays open (CSS cross-fades the change), and in development
// lets ?sky=dawn|day|dusk|night force a phase for screenshots.
function currentPhase() {
  if (DEV) {
    try {
      const fromQuery = new URLSearchParams(window.location.search).get("sky");
      if (isSkyPhase(fromQuery)) {
        sessionStorage.setItem("solcafe-sky", fromQuery);
        return fromQuery;
      }
      const stored = sessionStorage.getItem("solcafe-sky");
      if (isSkyPhase(stored)) return stored;
    } catch {
      // storage unavailable; fall through to the real phase
    }
  }
  return getSkyPhase();
}

export default function SkyClock() {
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const phase = currentPhase();
      if (root.getAttribute("data-sky") !== phase) {
        root.setAttribute("data-sky", phase);
      }
    };
    apply();
    const id = window.setInterval(apply, FIVE_MINUTES);
    return () => window.clearInterval(id);
  }, []);
  return null;
}
