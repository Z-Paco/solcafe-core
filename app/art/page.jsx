"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import "../styles/art.css";

export default function Artpage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [artPosts, setArtPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch art posts from Supabase
  useEffect(() => {
    async function fetchArtPosts() {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("content_type", "art")
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setArtPosts(data || []);
      } catch (err) {
        console.error("Error fetching art posts:", err);
        setError("Failed to load art posts. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchArtPosts();
  }, [supabase]);

  return (
    <main>
      <div className="page-header">
        <h1>Art Gallery</h1>
        {session && (
          <Link href="/art/create" className="create-button">
            Create Art Post
          </Link>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading art gallery...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : artPosts.length === 0 ? (
        <div className="empty-state">
          <p>No art posts yet. Be the first to share your artwork!</p>
          {session && (
            <Link href="/art/create" className="create-button">
              Create Art Post
            </Link>
          )}
        </div>
      ) : (
        <div className="art-gallery">
          {artPosts.map((post) => {
            console.log("Gallery post slug:", post.slug);
            return (
              <Link
                href={`/art/${post.slug}`}
                key={post.id}
                className="art-item-link"
              >
                <div className="art-item">
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <div className="caption">{post.title}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
