import React from "react";
import Link from "next/link";
import "../app/styles/home.css";

export default function HomePage() {
  return (
    <main id="main-content">
      {/* Hero section with visual impact */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Solcafe</h1>
          <h2>Envisioning a Sustainable Future Through Stewardship</h2>
          <p className="hero-subtitle">
            A community where faith, creativity, and innovation intersect to
            create a brighter, greener tomorrow
          </p>
          <div className="hero-cta">
            <Link href="/about" className="btn-primary">
              Learn More
            </Link>
            <Link href="/signup" className="btn-eco">
              Join Our Community
            </Link>
          </div>
        </div>
      </section>

      {/* Explanation section */}
      <section className="mission-section card">
        <h2>Our Mission</h2>
        <p>
          Solcafe is where sustainability meets community. We bring together
          artists, engineers, and knowledge keepers to collaborate on projects
          that care for our Earth while building vibrant communities.
        </p>
        <p>
          Inspired by solarpunk ideals and grounded in our commitment to
          stewardship, we're creating spaces that spark creativity and inspire
          meaningful change.
        </p>
      </section>

      {/* Content categories section */}
      <section className="features-section">
        <h2>Explore Our Community</h2>
        <div className="features-grid">
          <div className="feature card">
            <div className="feature-icon">🎨</div>
            <h3>Art & Creativity</h3>
            <p>
              Discover and share solarpunk-inspired artwork, stories, and
              creative visions.
            </p>
            <Link href="/art" className="feature-link">
              Explore Art <span className="arrow">→</span>
            </Link>
          </div>

          <div className="feature card">
            <div className="feature-icon">⚙️</div>
            <h3>Engineering & Projects</h3>
            <p>
              See sustainable projects, share your own work, and join
              engineering discussions.
            </p>
            <Link href="/engineer" className="feature-link">
              Explore Engineering <span className="arrow">→</span>
            </Link>
          </div>

          <div className="feature card">
            <div className="feature-icon">📰</div>
            <p>
              Stay informed with community news, research, and the latest
              sustainability insights.
            </p>
            <Link href="/news" className="feature-link">
              Read News <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Roles Explanation Section */}
      <section className="roles-section">
        <h2>Choose Your Role</h2>
        <p className="roles-intro">
          Solcafe welcomes all who want to build a better future. Your expertise
          will grow and develop as you explore posts made by the community.
          Choose where you fit best:
        </p>

        <div className="roles-grid">
          {/* Dreamer Role Card */}
          <div className="role-card card">
            <div className="role-icon">
              <img src="/images/icons/dreamer-icon.svg" alt="Dreamer icon" />
            </div>
            <h3>Dreamer</h3>
            <p>
              Artists, visionaries, and storytellers who imagine sustainable
              futures through creative expression.
            </p>
            <ul className="role-traits">
              <li>Create inspiring art and stories</li>
              <li>Envision how spaces could be transformed</li>
              <li>Share hopeful visions of the future</li>
            </ul>
          </div>

          {/* Techie Role Card */}
          <div className="role-card card">
            <div className="role-icon">
              <img src="/images/icons/techie-icon.svg" alt="Techie icon" />
            </div>
            <h3>Techie</h3>
            <p>
              Engineers, makers, and problem-solvers who build practical
              solutions for sustainable living.
            </p>
            <ul className="role-traits">
              <li>Design sustainable technologies</li>
              <li>Build and share DIY projects</li>
              <li>Collaborate on technical challenges</li>
            </ul>
          </div>

          {/* Book Keeper Role Card */}
          <div className="role-card card">
            <div className="role-icon">
              <img
                src="/images/icons/bookkeeper-icon.svg"
                alt="Book Keeper icon"
              />
            </div>
            <h3>Book Keeper</h3>
            <p>
              Researchers, writers, and knowledge-sharers who collect and
              preserve wisdom for future generations.
            </p>
            <ul className="role-traits">
              <li>Research sustainable practices</li>
              <li>Document successful projects</li>
              <li>Share educational resources</li>
            </ul>
          </div>
        </div>

        <div className="roles-cta">
          <p>
            Most members contribute across multiple roles - find where your
            passion leads you!
          </p>
          <Link href="/about#roles" className="btn-eco">
            Learn More About Roles
          </Link>
        </div>
      </section>

      {/* Community highlights or call to action */}
      <section className="join-section">
        <div className="join-content">
          <h2>Join a Growing Movement</h2>
          <p>
            Connect with others who share your passion for creating a more
            sustainable and beautiful world. Whether you're a dreamer, a
            builder, or a knowledge keeper, there's a place for you at Solcafe.
          </p>
          <Link href="/signup" className="btn-primary">
            Get Started Today
          </Link>
        </div>
      </section>
    </main>
  );
}
