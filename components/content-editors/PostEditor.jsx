"use client";
import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ArtContentEditor from "./content-editors/ArtContentEditor";
import EngineeringContentEditor from "./content-editors/EngineeringContentEditor";
import NewsContentEditor from "./content-editors/NewsContentEditor";
import "../app/styles/postEditor.css";

export default function PostEditor({ userId, existingPost = null }) {
  const supabase = useSupabaseClient();
  const router = useRouter();

  // Base post data
  const [title, setTitle] = useState(existingPost?.title || "");
  const [description, setDescription] = useState(
    existingPost?.description || ""
  );
  const [contentType, setContentType] = useState(
    existingPost?.content_type || "news"
  );
  const [tags, setTags] = useState(existingPost?.tags?.join(", ") || "");
  const [coverImage, setCoverImage] = useState(existingPost?.image_url || "");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [published, setPublished] = useState(existingPost?.published || false);

  // Type-specific content
  const [specializedContent, setSpecializedContent] = useState({});

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Initialize specialized content from existing post
  useEffect(() => {
    if (existingPost?.metadata) {
      setSpecializedContent(existingPost.metadata);
    }
  }, [existingPost]);

  // Create slug from title
  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  // Handle cover image change
  const handleCoverImageChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    setCoverImageFile(file);

    // Preview the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Upload cover image to storage
  const uploadCoverImage = async (file) => {
    if (!file) return null;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `cover-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from("post-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload cover image");
    }
  };

  // Handle specialized content updates
  const updateSpecializedContent = (contentData) => {
    setSpecializedContent((prev) => ({
      ...prev,
      ...contentData,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Process tags into array
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Create slug if not exists
      const slug = existingPost?.slug || createSlug(title);

      // Upload cover image if new file selected
      let finalCoverImage = coverImage;
      if (coverImageFile) {
        finalCoverImage = await uploadCoverImage(coverImageFile);
      }

      // Prepare post data
      const postData = {
        title,
        description,
        content_type: contentType,
        tags: tagsArray,
        image_url: finalCoverImage,
        published,
        slug,
        metadata: specializedContent,
      };

      if (existingPost) {
        // Update existing post
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", existingPost.id);

        if (error) throw error;
      } else {
        // Create new post
        postData.user_id = userId;

        const { error } = await supabase.from("posts").insert(postData);

        if (error) throw error;
      }

      setSuccess(true);

      // Redirect or reset form
      if (published) {
        setTimeout(() => {
          router.push(`/posts/${slug}`);
        }, 1500);
      } else if (!existingPost) {
        // Clear form for new draft
        setTitle("");
        setDescription("");
        setTags("");
        setCoverImage("");
        setCoverImageFile(null);
        setPublished(false);
        setSpecializedContent({});
      }
    } catch (error) {
      console.error("Error saving post:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Render the appropriate content editor based on type
  const renderContentEditor = () => {
    switch (contentType) {
      case "art":
        return (
          <ArtContentEditor
            content={specializedContent}
            updateContent={updateSpecializedContent}
            userId={userId}
          />
        );
      case "engineering":
        return (
          <EngineeringContentEditor
            content={specializedContent}
            updateContent={updateSpecializedContent}
            userId={userId}
          />
        );
      case "news":
      default:
        return (
          <NewsContentEditor
            content={specializedContent}
            updateContent={updateSpecializedContent}
            userId={userId}
          />
        );
    }
  };

  return (
    <div className={`post-editor ${contentType}-editor`}>
      <h1>{existingPost ? "Edit Post" : "Create New Post"}</h1>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">
          Post {existingPost ? "updated" : "created"} successfully!
          {published && " Redirecting to your published post..."}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Content Type Selection */}
        <div className="form-group">
          <label htmlFor="contentType">Content Type *</label>
          <select
            id="contentType"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            disabled={existingPost} // Can't change type of existing post
          >
            <option value="news">News Article</option>
            <option value="art">Art Showcase</option>
            <option value="engineering">Engineering Project</option>
          </select>
        </div>

        {/* Basic Details Section */}
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter post title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Brief summary of your post"
            rows="3"
          />
        </div>

        {/* Cover Image */}
        <div className="form-group">
          <label htmlFor="coverImage">Cover Image</label>
          <input
            type="file"
            id="coverImage"
            accept="image/*"
            onChange={handleCoverImageChange}
          />
          {coverImage && (
            <div className="image-preview">
              <img src={coverImage} alt="Cover preview" />
            </div>
          )}
        </div>

        {/* Specialized Content Editor */}
        {renderContentEditor()}

        {/* Tags */}
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Comma-separated tags (e.g., solar, energy, diy)"
          />
          <small>Separate tags with commas</small>
        </div>

        {/* Publishing Options */}
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publish immediately
          </label>
          <small>Unpublished posts will be saved as drafts</small>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : existingPost
              ? "Update Post"
              : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
