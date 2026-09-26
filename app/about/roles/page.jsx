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
            The Solarpunk movement is blessed to have many walks of life,
            visions, skills, and experiences. These roles harness these
            attributes into a system that encourages collaboration, learning,
            and growth for everyone involved.
          </p>
        </div>

        <div className="role-section card">
          <h3>Meet the Trio</h3>
          <div className="role-grid">
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
            <div className="role-card">
              <div className="role-icon">
                <img src="/images/icons/techie-icon.svg" alt="Techie icon" />
              </div>
              <h4>Meet the Techie</h4>
              <p>
                Engineers, makers, and problem-solvers who build practical
                solutions for sustainable living.
              </p>
            </div>
            <div className="role-card">
              <div className="role-icon">
                <img
                  src="/images/icons/bookkeeper-icon.svg"
                  alt="Book Keeper icon"
                />
              </div>
              <h4>Meet the Book Keeper</h4>
              <p>
                Researchers, writers, and knowledge-sharers who collect and
                preserve wisdom for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
