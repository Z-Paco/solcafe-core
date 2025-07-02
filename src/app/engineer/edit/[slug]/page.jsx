"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import "../../../styles/postEditor.css";

export default function EditEngineerPage() {
  const router = useRouter();
  const pathname = usePathname();
  const slug = pathname.split("/").pop();
  const supabase = createClientComponentClient();

  // State for post data and form fields
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [metadata, setMetadata] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch post, user, and role info on mount
  useEffect(() => {
    async function fetchPost() {
      try {
        // Get current user securely
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) {
          router.push("/login?redirect=/engineer/edit/" + slug);
          return;
        }
        // Fetch role_id from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("role_id")
          .eq("id", user.id)
          .single();
        setRoleId(profile?.role_id || null);

        // Fetch the engineering post by slug
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .eq("content_type", "engineering")
          .single();
        if (error) throw error;

        // Permission check: allow if owner or admin
        if (data.user_id !== user.id && profile?.role_id !== 4) {
          setError("You do not have permission to edit this project");
          return;
        }
        setPost(data);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setTags(data.tags || "");
        setIsPublished(data.published);
        setMetadata(data.metadata || {});
      } catch (error) {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug, router, supabase]);

  // Handle form submission for saving changes
  const handleSubmit = async (e) => {
    e.preventDefault();

    setValidationErrors({});
    const errors = {};

    // Validate fields
    if (!title.trim()) {
      errors.title = "Title is required";
    } else if (title.length > 100) {
      errors.title = "Title must be less than 100 characters";
    }
    if (!description.trim()) {
      errors.description = "Description is required";
    } else if (description.length > 5000) {
      errors.description = "Description is too long (max 5000 characters)";
    }
    if (tags && typeof tags === "string" && tags.length > 200) {
      errors.tags = "Tags are too long (max 200 characters)";
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setSaving(true);

    try {
      // Update the post in Supabase
      const { error } = await supabase
        .from("posts")
        .update({
          title,
          description,
          metadata,
          tags,
          published: isPublished,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);
      if (error) throw error;
      router.push(`/engineer/${slug}`);
    } catch (error) {
      setError("Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  // Handle deleting the post (admin or owner)
  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("posts").delete().eq("id", post.id);
      if (error) throw error;
      router.push("/engineer");
    } catch (error) {
      setError("Failed to delete project");
    } finally {
      setSaving(false);
    }
  };

  // Loading and error states
  if (loading) return <div className="loading-spinner">Loading project...</div>;
  if (error) return <div className="error-message">{error}</div>;

  // Main editor UI
  return (
    <main className="post-editor engineering-content-editor">
      <div className="edit-header">
        <h1>Edit Engineering Project</h1>
        <div className="actions">
          <Link href={`/engineer/${slug}`} className="cancel-button">
            Cancel
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="edit-form">
        {/* Title field */}
        <div className="form-group">
          <label htmlFor="title">Project Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={validationErrors.title ? "input-error" : ""}
            required
          />
          {validationErrors.title && (
            <div className="field-error">{validationErrors.title}</div>
          )}
          <small>{title.length}/100 characters</small>
        </div>
        {/* Description field */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            className={validationErrors.description ? "input-error" : ""}
            required
          />
          {validationErrors.description && (
            <div className="field-error">{validationErrors.description}</div>
          )}
          <small>{description.length}/5000 characters</small>
        </div>
        {/* Tags field */}
        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={validationErrors.tags ? "input-error" : ""}
          />
          {validationErrors.tags && (
            <div className="field-error">{validationErrors.tags}</div>
          )}
          <small>{tags.length}/200 characters</small>
        </div>
        {/* Metadata editor (customize as needed) */}
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <input
            type="text"
            id="difficulty"
            value={metadata.difficulty || ""}
            onChange={(e) =>
              setMetadata({ ...metadata, difficulty: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="timeRequired">Time Required</label>
          <input
            type="text"
            id="timeRequired"
            value={metadata.timeRequired || ""}
            onChange={(e) =>
              setMetadata({ ...metadata, timeRequired: e.target.value })
            }
          />
        </div>
        {/* Published checkbox */}
        <div className="form-group">
          <label className="publish-label">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            Published
          </label>
        </div>
        {/* Save and Delete actions */}
        <div className="form-actions">
          <button type="submit" className="save-button" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}
            disabled={saving}
          >
            {saving ? "Processing..." : "Delete Project"}
          </button>
        </div>
      </form>
    </main>
  );
}
