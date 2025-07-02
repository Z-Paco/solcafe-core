"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import ArtContentEditor from "@/components/content-editors/ArtContentEditor";
import "../../../styles/postEditor.css";

export default function EditArtPage() {
  const router = useRouter();
  const pathname = usePathname();
  const slug = pathname.split("/").pop();
  const supabase = createClientComponentClient();

  // State for post data and form fields
  const [art, setArt] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(false);
  const [artContent, setArtContent] = useState({});
  const [roleId, setRoleId] = useState(null);
  const [updateArtContent, setUpdateArtContent] = useState(() => {
    const fn = (content) => {
      setArtContent(content);
    };
    fn.validate = () => true;
    return fn;
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch post, user, and role info on mount
  useEffect(() => {
    async function fetchArt() {
      try {
        // Get current user
        const { data: user } = await supabase.auth.getUser();
        if (!user?.user) {
          router.push("/login?redirect=/art/edit/" + slug);
          return;
        }
        // Fetch role_id from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("role_id")
          .eq("id", user.user.id)
          .single();
        setRoleId(profile?.role_id || null);

        // Fetch the art post by slug
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .eq("content_type", "art")
          .single();
        if (error) throw error;

        // Permission check: allow if owner or admin
        if (data.user_id !== user.user.id && profile?.role_id !== 4) {
          setError("You do not have permission to edit this artwork");
          return;
        }
        setArt(data);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setTags(data.tags || "");
        setIsPublished(data.published);

        // Parse metadata for art content
        try {
          const contentData = data.metadata ? data.metadata : {};
          setArtContent({
            images: contentData.images || [],
            medium: contentData.medium || "",
            collaborators: contentData.collaborators || "",
          });
        } catch {
          setArtContent({
            images: [],
            medium: "",
            collaborators: "",
          });
        }
      } catch (error) {
        setError("Failed to load artwork");
      } finally {
        setLoading(false);
      }
    }
    fetchArt();
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
    if (!updateArtContent.validate()) {
      return;
    }

    setSaving(true);

    try {
      // Use first image as cover if available
      const finalCoverImage =
        artContent.images && artContent.images[0]
          ? artContent.images[0].url
          : "";

      // Update the post in Supabase
      const { error } = await supabase
        .from("posts")
        .update({
          title,
          description,
          metadata: artContent,
          tags,
          image_url: finalCoverImage,
          published: isPublished,
          updated_at: new Date().toISOString(),
        })
        .eq("id", art.id);
      if (error) throw error;
      router.push(`/art/${slug}`);
    } catch (error) {
      setError("Failed to update artwork");
    } finally {
      setSaving(false);
    }
  };

  // Handle deleting the post (admin or owner)
  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this artwork? This action cannot be undone."
      )
    ) {
      return;
    }

    setSaving(true);
    try {
      // Delete the post
      const { error } = await supabase.from("posts").delete().eq("id", art.id);
      if (error) throw error;
      // Optionally remove images from storage
      if (artContent.images && artContent.images.length > 0) {
        const paths = artContent.images
          .filter((image) => image.path)
          .map((image) => image.path);
        if (paths.length > 0) {
          await supabase.storage.from("post-images").remove(paths);
        }
      }
      router.push("/art");
    } catch (error) {
      console.error("Error deleting artwork:", error);
      setError("Failed to delete artwork");
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
          <h2>{title || "Untitled Artwork"}</h2>
          {artContent.images && artContent.images[0] && (
            <div className="preview-image">
              <img src={artContent.images[0].url} alt={title || "Artwork"} />
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
  if (loading) return <div className="loading-spinner">Loading artwork...</div>;
  if (error) return <div className="error-message">{error}</div>;

  // Main editor UI
  return (
    <main className="post-editor art-content-editor">
      <div className="edit-header">
        <h1>Edit Artwork</h1>
        <div className="actions">
          <button
            className={`preview-toggle ${preview ? "active" : ""}`}
            onClick={() => setPreview(!preview)}
          >
            {preview ? "Edit Mode" : "Preview Mode"}
          </button>
          <Link href={`/art/${slug}`} className="cancel-button">
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
            <label htmlFor="title">Artwork Title</label>
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
          {/* Current image preview */}
          {artContent.images && artContent.images[0] && (
            <div className="current-image">
              <img src={artContent.images[0].url} alt="Current artwork" />
            </div>
          )}
          {/* Art content editor */}
          <ArtContentEditor
            content={artContent}
            updateContent={updateArtContent}
            userId={art.user_id}
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
              {saving ? "Processing..." : "Delete Artwork"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
