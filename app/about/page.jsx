"use client";
import React from "react";
import "../styles/about.css";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main id="main-content">
      <section className="about-content">
        <h1>About Solcafe</h1>

        <div className="about-section card">
          <h3>What this is</h3>
          <p>
            Solcafe is a student-built portfolio project around energy
            stewardship in Alberta, rooted in a Catholic understanding of
            creation care. It treats art and engineering as one integrated
            practice — a place for informative energy content and the
            creative work that imagines better systems.
          </p>
        </div>

        <div className="about-section card">
          <h3>What you&apos;ll find</h3>
          <p>
            News is the entry point: short, sourced energy updates. Art and
            engineering posts are secondary — experiments and visual thinking
            alongside the reporting.
          </p>
        </div>

        <div className="about-section card">
          <h3>Status</h3>
          <p>
            Built while finishing a Software Development diploma at SAIT, so
            scope is intentionally capped. Roles (Dreamer, Techie, Book Keeper)
            are presentational only — they don&apos;t gate access or content.
          </p>
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <Link href="/news" className="btn-primary">
              Browse News
            </Link>
            <Link href="/about/roles" className="btn-eco">
              Learn More About Roles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
