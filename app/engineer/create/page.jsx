"use client";
import { useState, useEffect } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import EngineeringContentEditor from "@/components/content-editors/EngineeringContentEditor";
import "../../styles/postEditor.css";

export default function CreateEngineeringPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);

  // Engineering-specific content
  const [engineeringContent, setEngineeringContent] = useState({});

  useEffect(() => {
    if (!session) {
      // Redirect if not logged in
      router.push("/login?redirect=/engineer/create");
      return;
    }

    setUserId(session.user.id);
    setLoading(false);
  }, [session, router]);

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
      const { data } = supabase.storage.from("post-images").getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload cover image");
    }
  };

  // Create slug from title
  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Validation
      if (!title.trim()) {
        throw new Error("Title is required");
      }

      if (!description.trim()) {
        throw new Error("Description is required");
      }

      // Validate engineering content (ensure there's at least some content)
      if (
        !engineeringContent.overview ||
        !engineeringContent.steps ||
        engineeringContent.steps.length === 0 ||
        !engineeringContent.steps[0].description
      ) {
        throw new Error("Project overview and at least one step are required");
      }

      // Process tags into array
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Create slug
      const slug = createSlug(title);

      // Upload cover image if provided
      let finalCoverImage = coverImage;
      if (coverImageFile) {
        finalCoverImage = await uploadCoverImage(coverImageFile);
      } else if (engineeringContent.schematics?.length > 0) {
        // Use first schematic as cover if no specific cover provided
        finalCoverImage = engineeringContent.schematics[0].url;
      }

      // Create post
      const { error } = await supabase.from("posts").insert({
        title,
        description,
        content_type: "engineering",
        tags: tagsArray,
        image_url: finalCoverImage,
        user_id: userId,
        published,
        slug,
        metadata: engineeringContent,
      });

      if (error) throw error;

      setSuccess(true);

      // Redirect or reset form
      if (published) {
        setTimeout(() => {
          router.push(`/engineer/${slug}`);
        }, 1500);
      } else {
        // Clear form for new draft
        setTimeout(() => {
          setTitle("");
          setDescription("");
          setTags("");
          setCoverImage("");
          setCoverImageFile(null);
          setPublished(false);
          setEngineeringContent({});
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving engineering post:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main>
        <div className="container">
          <div className="loading-container">
            <p>Loading editor...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        <div className="post-editor engineering-editor">
          <h1>Create Engineering Project</h1>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              Project created successfully!
              {published
                ? " Redirecting to your published project..."
                : " You can create another project."}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter project title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Short Description *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Brief summary of your project (will appear in cards and previews)"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="coverImage">Cover Image</label>
              <p className="field-description">
                Optional: Choose a cover image, or the first schematic will be used
              </p>
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

            {/* Engineering-specific content editor */}
            <EngineeringContentEditor
              content={engineeringContent}
              updateContent={setEngineeringContent}
              userId={userId}
            />

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Comma-separated tags (e.g., electronics, renewable, arduino)"
              />
              <small>Separate tags with commas</small>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                Publish immediately
              </label>
              <small>Unpublished projects will be saved as drafts</small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => router.push("/engineer")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}