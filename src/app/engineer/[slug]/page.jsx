"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import "../../styles/templates/postDetail.css";

export default function EngineeringPostPage() {
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

  // Fetch post data and user role
  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;

      try {
        // Fetch post
        const { data, error } = await supabase
          .from("posts")
          .select("*, profiles(username, avatar_url)")
          .eq("slug", slug)
          .eq("content_type", "engineering")
          .single();

        if (error) throw error;
        if (!data) {
          setError("Project not found");
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
        console.error("Error fetching project:", err);
        setError("Failed to load project. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug, supabase, session]);

  // Handle delete post
  const handleDeletePost = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase.from("posts").delete().eq("id", post.id);

      if (error) throw error;

      router.push("/engineer");
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project. Please try again.");
    }
  };

  if (loading) {
    return (
      <main>
        <div className="container">
          <div className="loading">Loading project details...</div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main>
        <div className="container">
          <div className="error-message">{error || "Project not found"}</div>
          <Link href="/engineer" className="back-button">
            Back to Engineering Projects
          </Link>
        </div>
      </main>
    );
  }

  // Show edit/delete if admin or owner
  const canEditOrDelete = userOwnsPost || roleId === 4;

  return (
    <main>
      <div className="container">
        <div className="post-detail engineering-post">
          <div className="post-header">
            <Link href="/engineer" className="back-button">
              ← Back to Projects
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
                <Link
                  href={`/engineer/edit/${post.slug}`}
                  className="edit-button"
                >
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

          {/* Featured image */}
          <div className="featured-image">
            <img src={post.image_url} alt={post.title} />
          </div>

          {/* Engineering metadata */}
          {post.metadata && (
            <div className="engineering-content">
              {/* Project overview */}
              {post.metadata.overview && (
                <div className="section">
                  <h2>Project Overview</h2>
                  <div className="project-overview">
                    {post.metadata.overview}
                  </div>
                </div>
              )}

              {/* Project metadata */}
              <div className="project-meta-container">
                {post.metadata.difficulty && (
                  <div className="project-meta-item">
                    <div className="meta-icon">⚙️</div>
                    <div className="meta-label">Difficulty</div>
                    <div className="meta-value">
                      {post.metadata.difficulty.charAt(0).toUpperCase() +
                        post.metadata.difficulty.slice(1)}
                    </div>
                  </div>
                )}

                {post.metadata.timeRequired && (
                  <div className="project-meta-item">
                    <div className="meta-icon">⏱️</div>
                    <div className="meta-label">Time Required</div>
                    <div className="meta-value">
                      {post.metadata.timeRequired}
                    </div>
                  </div>
                )}
              </div>

              {/* Materials list */}
              {post.metadata.materials &&
                post.metadata.materials.length > 0 && (
                  <div className="section">
                    <h2>Materials</h2>
                    <ul className="materials-list">
                      {post.metadata.materials.map((material, index) => (
                        <li key={index} className="material-item">
                          <span className="material-name">{material.name}</span>
                          {material.quantity && (
                            <span className="material-quantity">
                              {material.quantity} {material.unit || ""}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Schematics/diagrams */}
              {post.metadata.schematics &&
                post.metadata.schematics.length > 0 && (
                  <div className="section">
                    <h2>Schematics & Diagrams</h2>
                    <div className="schematics-gallery">
                      {post.metadata.schematics.map((schematic, index) => (
                        <div key={index} className="schematic-item">
                          <img
                            src={schematic.url}
                            alt={schematic.caption || `Schematic ${index + 1}`}
                          />
                          {schematic.caption && (
                            <div className="schematic-caption">
                              {schematic.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Build steps */}
              {post.metadata.steps && post.metadata.steps.length > 0 && (
                <div className="section">
                  <h2>Build Steps</h2>
                  <div className="steps-list">
                    {post.metadata.steps.map((step, index) => (
                      <div key={index} className="step-item">
                        <div className="step-header">
                          <div className="step-number">{index + 1}</div>
                          {step.title && (
                            <h3 className="step-title">{step.title}</h3>
                          )}
                        </div>
                        <div className="step-content">
                          {step.imageUrl && (
                            <div className="step-image">
                              <img
                                src={step.imageUrl}
                                alt={`Step ${index + 1}`}
                              />
                            </div>
                          )}
                          <div className="step-description">
                            {step.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code snippets */}
              {post.metadata.codeSnippets &&
                post.metadata.codeSnippets.length > 0 && (
                  <div className="section">
                    <h2>Code Snippets</h2>
                    <div className="code-snippets">
                      {post.metadata.codeSnippets.map((snippet, index) => (
                        <div key={index} className="code-snippet">
                          <div className="snippet-header">
                            {snippet.description && (
                              <div className="snippet-description">
                                {snippet.description}
                              </div>
                            )}
                            {snippet.language && (
                              <div className="snippet-language">
                                {snippet.language}
                              </div>
                            )}
                          </div>
                          <pre className="code-block">
                            <code>{snippet.code}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
