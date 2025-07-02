"use client";
import React from "react";
import "../../styles/about.css";

export default function RolesPage() {
  return (
    <main id="main-content">
      <section className="roles-content">
        <h1>Roles: Meaning, Origin, and Future</h1>

        <div className="role-section card">
          <h3>Why Roles?</h3>
          <p>
            The roles are a fun way to display a user's strengths and passions.
            They introduce mastery and progression that I want to build this
            platform around. The Solarpunk movement is blessed to have many
            walks of life, visions, skills, and experiences. These roles hope to
            harness these attributes into a system that encourages
            collaboration, learning, and growth for everyone involved.
          </p>
        </div>

        <div className="role-section card">
          <h3> Meet the Trio</h3>
          <div className="role-grid">
            {/* Dreamer */}
            <div className="role-card">
              <div className="role-icon">
                <img src="/images/icons/dreamer-icon.svg" alt="Dreamer icon" />
              </div>
              <h4>Meet the Dreamer</h4>
              <p>
                Artists, visionaries, and storytellers who imagine sustainable
                futures through creative expression.
              </p>
            </div>
            {/* Techie */}
            <div className="role-card">
              <div className="role-icon">
                <img src="/images/icons/techie-icon.svg" alt="Techie icon" />
              </div>
              <h4>Meet the Techie</h4>
              <p>
                Engineers, makers, and problem-solvers who build pracitical
                solutions for sustainable living.
              </p>
            </div>
            {/* Book Keeper */}
            <div className="role-card">
              <div className="role-icon">
                <img
                  src="/images/icons/bookkeeper-icon.svg"
                  alt="Book Keeper"
                />
              </div>
              <h4>Meet the Book Keeper</h4>
              <p>
                Researchers, writers, and knowledge-sharers who collect and
                preserve wisdom for future generations
              </p>
            </div>
          </div>
        </div>

        <div className="role-section card">
          <h3>Future Roles</h3>
          <p>
            As Solcafe grows, roles Will evolve to inclued new skills, badges,
            and collaborative opportunities. Members will be able to level up,
            mentor others, and contribute to projects that span Multiple
            disciplines.
          </p>
        </div>
      </section>
    </main>
  );
}
