"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import EngineeringContentEditor from "@/components/content-editors/EngineeringContentEditor";
import "../../../styles/postEditor.css";

export default function EditEngineerPage() {
  const router = useRouter();
  const pathname = usePathname();
  const slug = pathname.split("/").pop();
  const [supabase] = useState(() => createClient());

  // State for post data and form fields
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(false);
  const [engineeringContent, setEngineeringContent] = useState({});
  // Validation lives in a ref populated by the editor via onValidate.
  const validateEngRef = useRef(() => true);
  const updateEngineeringContent = useCallback((content) => {
    setEngineeringContent(content);
  }, []);
  const handleEngValidate = useCallback((fn) => {
    validateEngRef.current = fn;
  }, []);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch post, user, and role info on mount
  useEffect(() => {
    async function fetchPost() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) {
          router.push("/login?redirect=/engineer/edit/" + slug);
          return;
        }

        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .eq("content_type", "engineering")
          .single();
        if (error) throw error;

        if (data.user_id !== user.id) {
          setError("You do not have permission to edit this project");
          return;
        }
        setPost(data);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setTags(data.tags || "");
        setIsPublished(data.published);

        // Parse metadata for engineering content
        try {
          const contentData = data.metadata ? data.metadata : {};
          setEngineeringContent({
            overview: contentData.overview || "",
            difficulty: contentData.difficulty || "intermediate",
            timeRequired: contentData.timeRequired || "",
            materials: contentData.materials || [],
            steps: contentData.steps || [],
            codeSnippets: contentData.codeSnippets || [],
            schematics: contentData.schematics || [],
          });
        } catch {
          setEngineeringContent({
            overview: "",
            difficulty: "intermediate",
            timeRequired: "",
            materials: [],
            steps: [],
            codeSnippets: [],
            schematics: [],
          });
        }
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
    if (!validateEngRef.current()) {
      return;
    }

    setSaving(true);

    try {
      // Use first schematic as cover if available
      const finalCoverImage =
        engineeringContent.schematics && engineeringContent.schematics[0]
          ? engineeringContent.schematics[0].url
          : post.image_url || "";

      // Update the post in Supabase
      const { error } = await supabase
        .from("posts")
        .update({
          title,
          description,
          metadata: engineeringContent,
          tags,
          image_url: finalCoverImage,
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
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id);
      if (error) throw error;
      router.push("/engineer");
    } catch (error) {
      setError("Failed to delete project");
    } finally {
      setSaving(false);
    }
  };

  // Render tags as elements
  const renderTagElements = (tagsInput) => {
    if (!tagsInput) return null;
    let tagsArray;
    if (Array.isArray(tagsInput)) {
      tagsArray = tagsInput;
    } else if (typeof tagsInput === "string") {
      tagsArray = tagsInput.split(",");
    } else {
      try {
        tagsArray = String(tagsInput).split(",");
      } catch {
        tagsArray = [];
      }
    }
    return tagsArray.map((tag) => {
      const trimmed = typeof tag === "string" ? tag.trim() : String(tag).trim();
      return (
        <span key={trimmed || Math.random()} className="tag">
          {trimmed || "untitled"}
        </span>
      );
    });
  };

  // Render preview mode
  const renderPreview = () => {
    try {
      return (
        <div className="content-preview">
          <h2>{title || "Untitled Project"}</h2>
          {engineeringContent.schematics &&
            engineeringContent.schematics[0] && (
              <div className="preview-image">
                <img
                  src={engineeringContent.schematics[0].url}
                  alt={title || "Project"}
                />
              </div>
            )}
          <p className="preview-description">
            {description || "No description provided."}
          </p>
          <div className="preview-tags">{renderTagElements(tags)}</div>
        </div>
      );
    } catch {
      return (
        <div className="preview-error">
          <h3>Error displaying preview</h3>
          <button className="edit-button" onClick={() => setPreview(false)}>
            Return to Edit Mode
          </button>
        </div>
      );
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
          <button
            className={`preview-toggle ${preview ? "active" : ""}`}
            onClick={() => setPreview(!preview)}
          >
            {preview ? "Edit Mode" : "Preview Mode"}
          </button>
          <Link href={`/engineer/${slug}`} className="cancel-button">
            Cancel
          </Link>
        </div>
      </div>
      {preview ? (
        renderPreview()
      ) : (
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
          {/* Engineering content editor */}
          <EngineeringContentEditor
            content={engineeringContent}
            updateContent={updateEngineeringContent}
            userId={post.user_id}
            onValidate={handleEngValidate}
          />
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
      )}
    </main>
  );
}
