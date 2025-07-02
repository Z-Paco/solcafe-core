"use client";
import React from "react";
// import "../styles/contact.css";

export default function ContactPage() {
  return (
    <main id="main-content">
      <section className="contact-content">
        <h1>Contact Solcafe</h1>
        <div className="contact-section card">
          <p>
            Have a question, suggestion, or want to get involved? Reach out
            using the form or email us directly at Email:{" "}
            <span style={{ color: "var(--theme-text-muted)" }}>
              NotRealEmail@solcafe.org
            </span>
          </p>
          {/* <button className="btn-primary" disabled>Contact Coming Soon</button> */}
        </div>
      </section>
    </main>
  );
}
