"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import "../../styles/templates/postDetail.css";

export default function NewsPostPage() {
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

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      try {
        // Fetch post
        const { data, error } = await supabase
          .from("posts")
          .select("*, profiles(username, avatar_url)")
          .eq("slug", slug)
          .eq("content_type", "news")
          .single();
        if (error) throw error;
        if (!data) {
          setError("News post not found");
          return;
        }
        setPost(data);

        // Check if current user is the post owner
        if (session && data.user_id === session.user.id) {
          setUserOwnsPost(true);
        }

        // Fetch role_id for current user
        if (session?.user?.id) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role_id")
            .eq("id", session.user.id)
            .single();
          setRoleId(profile?.role_id || null);
        }
      } catch (err) {
        console.error("Error fetching news post:", err);
        setError("Failed to load news post. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug, supabase, session]);

  const handleDeletePost = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this news post? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      const { error } = await supabase.from("posts").delete().eq("id", post.id);
      if (error) throw error;
      router.push("/news");
    } catch (err) {
      console.error("Error deleting news post:", err);
      alert("Failed to delete news post. Please try again.");
    }
  };

  if (loading) {
    return (
      <main>
        <div className="container">
          <div className="loading">Loading news post...</div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main>
        <div className="container">
          <div className="error-message">{error || "News post not found"}</div>
          <Link href="/news" className="back-button">
            Back to News
          </Link>
        </div>
      </main>
    );
  }

  const { metadata = {} } = post;
  const canEditOrDelete = userOwnsPost || roleId === 4;

  return (
    <main>
      <div className="container">
        <div className="post-detail news-post">
          <div className="post-header">
            <Link href="/news" className="back-button">
              ← Back to News
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
            {canEditOrDelete && (
              <div className="post-actions">
                <Link href={`/news/edit/${post.slug}`} className="edit-button">
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

          {/* Cover or first related link image */}
          {post.image_url || metadata.relatedLinks?.[0]?.imageUrl ? (
            <div className="featured-image">
              <img
                src={
                  post.image_url ||
                  metadata.relatedLinks?.[0]?.imageUrl ||
                  "/images/placeholder-news.jpg"
                }
                alt={post.title}
              />
            </div>
          ) : (
            <div className="no-image-header">
              <div className="post-category">News</div>
            </div>
          )}

          {/* Main content */}
          {metadata.mainContent && (
            <div className="section">
              <h2>Article Content</h2>
              <div className="news-main-content">{metadata.mainContent}</div>
            </div>
          )}

          {/* Quotes */}
          {metadata.quotes && metadata.quotes.length > 0 && (
            <div className="section">
              <h2>Key Quotes</h2>
              <ul className="quotes-list">
                {metadata.quotes.map((quote, idx) => (
                  <li key={idx} className="quote-item">
                    <blockquote>{quote.text}</blockquote>
                    {quote.attribution && <cite>— {quote.attribution}</cite>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sources */}
          {metadata.sources && metadata.sources.length > 0 && (
            <div className="section">
              <h2>Sources</h2>
              <ul className="sources-list">
                {metadata.sources.map((source, idx) => (
                  <li key={idx} className="source-item">
                    {source.name && <span className="source-name">{source.name}: </span>}
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="source-link"
                    >
                      {source.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Links */}
          {metadata.relatedLinks && metadata.relatedLinks.length > 0 && (
            <div className="section">
              <h2>Related Links</h2>
              <div className="related-links-gallery">
                {metadata.relatedLinks.map((link, idx) => (
                  <div key={idx} className="related-link-item">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="related-link-wrapper"
                    >
                      {link.imageUrl && (
                        <div className="link-preview">
                          <img
                            src={link.imageUrl}
                            alt={link.title || "Link preview"}
                          />
                        </div>
                      )}
                      <div className="related-link-content">
                        <span className="related-link-title">
                          {link.title || link.url}
                        </span>
                        {link.comment && (
                          <div className="related-link-comment">
                            {link.comment}
                          </div>
                        )}
                      </div>
                    </a>
                  </div>
                ))}
              </div>
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
