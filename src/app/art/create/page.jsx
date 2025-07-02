"use client";
import { useState, useEffect } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import ArtContentEditor from "@/components/content-editors/ArtContentEditor";
import "../../styles/postEditor.css";

export default function CreateArtPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);

  // Art-specific content
  const [artContent, setArtContent] = useState({});

  useEffect(() => {
    if (!session) {
      // Redirect if not logged in
      router.push("/login?redirect=/art/create");
      return;
    }

    setUserId(session.user.id);
    setLoading(false);
  }, [session, router]);

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
      if (!title.trim()) throw new Error("Title is required");
      if (!description.trim()) throw new Error("Description is required");
      if (!artContent.images || artContent.images.length === 0) {
        throw new Error("At least one image is required for art posts");
      }

      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const slug = createSlug(title);

      // Always use the first uploaded image as the cover
      const finalCoverImage = artContent.images[0].url;

      const { error } = await supabase.from("posts").insert({
        title,
        description,
        content_type: "art",
        tags: tagsArray,
        image_url: finalCoverImage,
        user_id: userId,
        published,
        slug,
        metadata: artContent,
      });

      if (error) throw error;

      setSuccess(true);

      // Redirect or reset form
      if (published) {
        setTimeout(() => {
          router.push(`/art/${slug}`);
        }, 1500);
      } else {
        // Clear form for new draft
        setTimeout(() => {
          setTitle("");
          setDescription("");
          setTags("");
          setPublished(false);
          setArtContent({});
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving art post:", error);
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
        <div className="post-editor art-editor">
          <h1>Create Art Post</h1>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              Art post created successfully!
              {published
                ? " Redirecting to your published post..."
                : " You can create another post."}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter art title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Describe your artwork"
                rows="3"
              />
            </div>

            {/* Art-specific content editor */}
            <ArtContentEditor
              content={artContent}
              updateContent={setArtContent}
              userId={userId}
            />

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Comma-separated tags (e.g., digital, painting, solarpunk)"
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
              <small>Unpublished posts will be saved as drafts</small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => router.push("/art")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Create Art Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
