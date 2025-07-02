"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import "../styles/news.css";

export default function Newspage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [newsPosts, setNewsPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news posts from Supabase
  useEffect(() => {
    async function fetchNewsPosts() {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("id, title, description, image_url, slug, created_at, user_id, tags, metadata")
          .eq("content_type", "news")
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
          // Set the first post as featured
          setFeaturedPost(data[0]);
          // Set the rest as regular posts
          setNewsPosts(data.slice(1));
        } else {
          setNewsPosts([]);
        }
      } catch (err) {
        console.error("Error fetching news posts:", err);
        setError("Failed to load news posts");
      } finally {
        setLoading(false);
      }
    }

    fetchNewsPosts();
  }, [supabase]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get a sample of tags to show as kicker
  const getKicker = (tags) => {
    if (!tags || tags.length === 0) return "News";
    return tags.slice(0, 2).join(" • ");
  };

  if (loading) {
    return (
      <main id="main-content">
        <div className="loading">Loading news...</div>
      </main>
    );
  }

  return (
    <main id="main-content">
      {/* Hero top story */}
      {featuredPost ? (
        <section className="hero-story">
          <article>
            <Link href={`/news/${featuredPost.slug}`}>
              <img 
                src={featuredPost.image_url || 
                     (featuredPost.metadata?.relatedLinks?.[0]?.imageUrl || "/news/placeholder.jpg")} 
                alt={featuredPost.title} 
              />
            </Link>
            <h2>
              <Link href={`/news/${featuredPost.slug}`}>{featuredPost.title}</Link>
            </h2>
            <div className="kicker">{getKicker(featuredPost.tags)}</div>
            <p className="teaser">{featuredPost.description}</p>
          </article>
        </section>
      ) : (
        <section className="hero-story empty-hero">
          <article>
            <h2>Latest News and Updates</h2>
            <p className="teaser">Stay informed with our curated news collection on sustainable technology and design</p>
          </article>
        </section>
      )}

      {/* Blog feed */}
      <section className="blog-feed">
        <div className="section-header">
          <h3>Latest Posts</h3>
          {session && (
            <Link href="/news/create" className="create-button">
              Create News Post
            </Link>
          )}
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {!loading && newsPosts.length === 0 && !featuredPost && (
          <div className="empty-state">
            <p>No news posts yet. Be the first to share news!</p>
            {session && (
              <Link href="/news/create" className="create-button">
                Create News Post
              </Link>
            )}
          </div>
        )}
        
        {newsPosts.map(post => (
          <article key={post.id} className="post-card">
            <h4>
              <Link href={`/news/${post.slug}`}>{post.title}</Link>
            </h4>
            <time dateTime={new Date(post.created_at).toISOString().split('T')[0]}>
              {formatDate(post.created_at)}
            </time>
            <p>{post.description}</p>
            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>

      {/* Submission Banner */}
      <section className="submission-banner" aria-live="polite">
        <h3>Want to Share News?</h3>
        {session ? (
          <Link href="/news/create" className="create-button">
            Create News Post
          </Link>
        ) : (
          <p>
            <Link href="/login?redirect=/news/create">Sign in</Link> to create and share news posts
          </p>
        )}
      </section>
    </main>
  );
}
