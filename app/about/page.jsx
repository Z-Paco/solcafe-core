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
          <h3>Solarpunk in a Nutshell</h3>
          <p>
            Solarpunk is a cultural and aesthetic movement that champions
            sustainability, renewable energy, and the harmonious integration of
            technology with nature. It envisions a future where communities
            thrive in green, self-sustaining environments: spaces that spark
            creativity and inspire social change. This optimistic vision has
            been a significant source of inspiration for Solcafe.
          </p>
        </div>

        <div className="about-section card">
          <h3>Our Purpose</h3>
          <p>
            Solcafe is a community of individuals committed to making serious
            change for the Earth. We focus on sustainability, providing a
            creative space for people to express transformative ideas, and
            offering an environment that inspires action.
          </p>
        </div>

        <div className="about-section card">
          <h3>Core Principles</h3>

          <div className="principle-item">
            <h4>Human Dignity:</h4>
            <p>
              We believe every person is created with inherent worth and
              deserves to be treated with respect and compassion. This belief
              serves as the foundation of every community interaction and
              innovation at Solcafe.
            </p>
          </div>

          <div className="principle-item">
            <h4>The Common Good:</h4>
            <p>
              We are committed to building a world where everyone has the
              opportunity to thrive. Our goal is to ensure that the benefits of
              progress and environmental stewardship are shared by all, rather
              than reserved for a few.
            </p>
          </div>

          <div className="principle-item">
            <h4>Stewardship of Creation:</h4>
            <p>
              We recognize our responsibility to care for the Earth and its
              resources. By protecting our environment today, we ensure its
              sustainability for future generations—and we draw on traditions
              that emphasize our sacred duty towards nature.
            </p>
          </div>
        </div>

        <div className="about-section card">
          <h3>Our Vision</h3>
          <p>
            Inspired by the Solarpunk ethos, I dream of Solcafe becoming the
            go-to destination for actionable information, spirited debates, and
            innovative ideas in the sustainable space. Our platform is designed
            for healthy discussions that challenge conventional approaches,
            especially when studies show certain methods are inefficient, and to
            offer a space where grievances can lead to breakthroughs in
            sustainability.
          </p>
        </div>

        <div className="about-section card">
          <h3>Join Us</h3>
          <p>
            Solcafe is designed for those with ambition and passion. We've
            segmented our content into areas that let you focus on your
            strengths: as a "Dreamer" in our art space, a "Techie" in
            engineering, or a "Book Keeper" of ideas in our news section. If
            you're eager to share your vision, join invigorating discussions, or
            simply get inspired by a new way of thinking, Solcafe is the place
            for you.
          </p>
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <button className="btn-primary">Sign Up</button>
            <Link href="/about/roles" className="btn-eco">
              Learn More About Roles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
