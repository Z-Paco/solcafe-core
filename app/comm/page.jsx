"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import "../styles/community.css";

export default function CommunityPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [featuredArt, setFeaturedArt] = useState(null);
  const [featuredEngineering, setFeaturedEngineering] = useState(null);
  const [featuredNews, setFeaturedNews] = useState(null);

  useEffect(() => {
    async function fetchFeatured() {
      const [{ data: artData }, { data: engData }, { data: newsData }] =
        await Promise.all([
          supabase
            .from("posts")
            .select("id, slug, title, image_url, description")
            .eq("content_type", "art")
            .eq("published", 1)
            .order("created_at", { ascending: false })
            .limit(1),
          supabase
            .from("posts")
            .select("id, slug, title, image_url, description")
            .eq("content_type", "engineering")
            .eq("published", 1)
            .order("created_at", { ascending: false })
            .limit(1),
          supabase
            .from("posts")
            .select("id, slug, title, image_url, description")
            .eq("content_type", "news")
            .eq("published", 1)
            .order("created_at", { ascending: false })
            .limit(1),
        ]);
      if (artData && artData.length > 0) setFeaturedArt(artData[0]);
      if (engData && engData.length > 0) setFeaturedEngineering(engData[0]);
      if (newsData && newsData.length > 0) setFeaturedNews(newsData[0]);
    }
    fetchFeatured();
  }, [supabase]);

  return (
    <main>
      <div className="container">
        <h1>Community & Collaboration</h1>

        {session ? (
          <div className="creation-hub">
            <h2>Create Content</h2>
            <p>What would you like to share with the community today?</p>
            <div className="content-creation-options">
              <Link href="/art/create" className="create-option">
                <div className="icon">🎨</div>
                <h3>Art</h3>
              </Link>
              <Link href="/engineer/create" className="create-option">
                <div className="icon">⚙️</div>
                <h3>Engineering</h3>
              </Link>
              <Link href="/news/create" className="create-option">
                <div className="icon">📰</div>
                <h3>News</h3>
              </Link>
            </div>
          </div>
        ) : (
          <div className="login-prompt">
            <p>Join our community to create and share content</p>
            <Link href="/login" className="login-button">
              Log In
            </Link>
          </div>
        )}

        {/* Featured Projects Grid */}
        {(featuredArt || featuredEngineering || featuredNews) && (
          <section className="featured-projects-section">
            <h2>Featured Projects</h2>
            <div className="featured-projects-grid">
              {featuredArt && (
                <div className="featured-project-card">
                  {featuredArt.image_url && (
                    <img
                      src={featuredArt.image_url}
                      alt={featuredArt.title || "Art Cover"}
                      className="featured-project-image"
                    />
                  )}
                  <div className="featured-project-content">
                    <h3>{featuredArt.title || "Untitled Art"}</h3>
                    <p>
                      {featuredArt.description?.slice(0, 100) ||
                        "A new creation from the community"}
                    </p>
                    <Link
                      href={`/art/${featuredArt.slug}`}
                      className="btn-primary"
                    >
                      View Art <span className="btn-icon">🎨</span>
                    </Link>
                  </div>
                </div>
              )}
              {featuredEngineering && (
                <div className="featured-project-card">
                  {featuredEngineering.image_url && (
                    <img
                      src={featuredEngineering.image_url}
                      alt={featuredEngineering.title || "Engineering Cover"}
                      className="featured-project-image"
                    />
                  )}
                  <div className="featured-project-content">
                    <h3>
                      {featuredEngineering.title || "Untitled Engineering"}
                    </h3>
                    <p>
                      {featuredEngineering.description?.slice(0, 100) ||
                        "A new engineering project from the community"}
                    </p>
                    <Link
                      href={`/engineer/${featuredEngineering.slug}`}
                      className="btn-primary"
                    >
                      View Engineering <span className="btn-icon">⚙️</span>
                    </Link>
                  </div>
                </div>
              )}
              {featuredNews && (
                <div className="featured-project-card">
                  {featuredNews.image_url && (
                    <img
                      src={featuredNews.image_url}
                      alt={featuredNews.title || "News Cover"}
                      className="featured-project-image"
                    />
                  )}
                  <div className="featured-project-content">
                    <h3>{featuredNews.title || "Untitled News"}</h3>
                    <p>
                      {featuredNews.description?.slice(0, 100) ||
                        "A new news post from the community"}
                    </p>
                    <Link
                      href={`/news/${featuredNews.slug}`}
                      className="btn-primary"
                    >
                      View News <span className="btn-icon">📰</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
