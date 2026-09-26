"use client";
import { useState, useEffect } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import NewsContentEditor from "@/components/content-editors/NewsContentEditor";
import "../../styles/postEditor.css";

export default function CreateNewsPage() {
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

  // News-specific content
  const [newsContent, setNewsContent] = useState({});

  useEffect(() => {
    if (!session) {
      router.push("/login?redirect=/news/create");
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

      // Validate news content (ensure there's at least some content)
      if (
        !newsContent.mainContent &&
        (!newsContent.relatedLinks || newsContent.relatedLinks.length === 0)
      ) {
        throw new Error(
          "Main content or at least one related link is required"
        );
      }

      // Process tags into array
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Create slug
      const slug = createSlug(title);

      // Determine final cover image URL
      let finalCoverImage = null;
      if (newsContent.relatedLinks?.length > 0 && newsContent.relatedLinks[0].imageUrl) {
        finalCoverImage = newsContent.relatedLinks[0].imageUrl;
      }

      // Create post
      const { error } = await supabase.from("posts").insert({
        title,
        description,
        content_type: "news",
        tags: tagsArray,
        image_url: finalCoverImage,
        user_id: userId,
        published,
        slug,
        metadata: newsContent,
      });

      if (error) throw error;

      setSuccess(true);

      // Redirect or reset form
      if (published) {
        setTimeout(() => {
          router.push(`/news/${slug}`);
        }, 1500);
      } else {
        setTimeout(() => {
          setTitle("");
          setDescription("");
          setTags("");
          setPublished(false);
          setNewsContent({});
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving news post:", error);
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
        <div className="post-editor news-editor">
          <h1>Create News Post</h1>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              News post created successfully!
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
                placeholder="Enter news post title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Short Description *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Brief summary of your news post (will appear in cards and previews)"
                rows="3"
              />
            </div>

            {/* News-specific content editor */}
            <NewsContentEditor
              content={newsContent}
              updateContent={setNewsContent}
            />

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Comma-separated tags (e.g., climate, policy, innovation)"
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
              <small>Unpublished news posts will be saved as drafts</small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => router.push("/news")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Create News Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
