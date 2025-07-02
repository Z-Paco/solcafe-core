"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import "../../styles/./templates/postDetail.css";

export default function ArtPostPage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  const session = useSession();
  const supabase = useSupabaseClient();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userOwnsPost, setUserOwnsPost] = useState(false);
  const [roleId, setRoleId] = useState(null);

  // Fetch post data
  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*, profiles(username, avatar_url)")
          .eq("slug", slug)
          .eq("content_type", "art")
          .single();

        if (error) throw error;

        if (!data) {
          setError("Post not found");
          return;
        }

        setPost(data);

        // Check if current user is the post owner
        if (session && data.user_id === session.user.id) {
          setUserOwnsPost(true);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug, supabase, session]);

  // Fetch role ID
  useEffect(() => {
    async function fetchRoleId() {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role_id")
          .eq("id", session.user.id)
          .single();
        if (data?.role_id) setRoleId(data.role_id);
      }
    }
    fetchRoleId();
  }, [session, supabase]);

  // Handle delete post
  const handleDeletePost = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase.from("posts").delete().eq("id", post.id);

      if (error) throw error;

      router.push("/art");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  if (loading) {
    return (
      <main>
        <div className="container">
          <div className="loading">Loading art post...</div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main>
        <div className="container">
          <div className="error-message">{error || "Post not found"}</div>
          <Link href="/art" className="back-button">
            Back to Art Gallery
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        <div className="post-detail art-post">
          <div className="post-header">
            <Link href="/art" className="back-button">
              ← Back to Gallery
            </Link>

            <h1 className="post-title">{post.title}</h1>

            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {(userOwnsPost || roleId === 4) && (
              <div className="post-actions">
                <Link href={`/art/edit/${post.slug}`} className="edit-button">
                  Edit
                </Link>
                <button className="delete-button" onClick={handleDeletePost}>
                  Delete
                </button>
                {roleId === 4 && !userOwnsPost && (
                  <span className="admin-action-label">Admin Action</span>
                )}
              </div>
            )}
          </div>

          <div className="post-meta">
            <div className="author-info">
              <img
                src={post.profiles?.avatar_url || "/images/default-avatar.jpg"}
                alt={post.profiles?.username || "User"}
                className="author-avatar"
              />
              <span className="author-name">
                {post.profiles?.username || "Anonymous"}
              </span>
            </div>
            <div className="post-date">
              {new Date(post.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="post-description">{post.description}</div>

          {/* Art metadata */}
          {post.metadata && (
            <div className="art-metadata">
              {post.metadata.medium && (
                <div className="metadata-item">
                  <span className="metadata-label">Medium:</span>
                  <span className="metadata-value">{post.metadata.medium}</span>
                </div>
              )}

              {post.metadata.collaborators && (
                <div className="metadata-item">
                  <span className="metadata-label">Collaborators:</span>
                  <span className="metadata-value">
                    {post.metadata.collaborators}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Art gallery */}
          {post.metadata?.images && post.metadata.images.length > 0 ? (
            <div className="art-gallery-full">
              {post.metadata.images.map((image, index) => (
                <div key={index} className="gallery-item">
                  <img
                    src={image.url}
                    alt={image.caption || `Art image ${index + 1}`}
                  />
                  {image.caption && (
                    <div className="image-caption">{image.caption}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="featured-image">
              <img src={post.image_url} alt={post.title} />
            </div>
          )}

          {/* Comment section placeholder */}
          <div className="comments-section">
            <h3>Comments</h3>
            <div className="comments-placeholder">
              <p>Comments feature coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
