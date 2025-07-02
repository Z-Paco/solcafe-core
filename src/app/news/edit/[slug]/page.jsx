"use client";
import { useState, useEffect } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { useRouter, useParams } from "next/navigation";
import NewsContentEditor from "@/components/content-editors/NewsContentEditor";
import "../../../styles/postEditor.css";

export default function EditNewsPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const params = useParams();
  const { slug } = params;

  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState(null);
  const [roleId, setRoleId] = useState(null); // <-- Add this
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);

  // News-specific content
  const [newsContent, setNewsContent] = useState({});

  // Cover image state
  const [coverImage, setCoverImage] = useState(null);

  // Create a ref for the validation function
  const [updateNewsContent, setUpdateNewsContent] = useState(() => {
    const fn = (content) => {
      setNewsContent(content);
    };
    fn.validate = () => true; // Default validate that always passes
    return fn;
  });

  useEffect(() => {
    if (!session) {
      router.push("/login?redirect=/news/edit/" + slug);
      return;
    }

    setUserId(session.user.id);

    async function fetchPost() {
      try {
        // Fetch role_id from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("role_id")
          .eq("id", session.user.id)
          .single();
        setRoleId(profile?.role_id || null);

        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .eq("content_type", "news")
          .single();

        if (error) throw error;

        if (!data) {
          setError("Post not found");
          return;
        }

        // Allow if current user is the post owner OR admin
        if (data.user_id !== session.user.id && profile?.role_id !== 4) {
          setError("You don't have permission to edit this post");
          return;
        }

        setPost(data);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setTags((data.tags || []).join(", "));
        setPublished(data.published || false);
        setNewsContent(data.metadata || {});
        setCoverImage(data.image_url);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [session, router, slug, supabase]);

  // Create slug from title
  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setValidationErrors({});

    // Form field validation like in the other edit pages...

    // If there are validation errors, show them and stop
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Check content editor validation
    if (!updateNewsContent.validate()) {
      // Content editor validation failed
      return;
    }

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

      // Check if title has changed, if so, update slug
      let newSlug = slug;
      if (title !== post.title) {
        newSlug = createSlug(title);
      }

      // Update cover image from related links if it doesn't exist
      let finalCoverImage = post.image_url;
      if (!finalCoverImage && newsContent.relatedLinks?.length > 0) {
        finalCoverImage = newsContent.relatedLinks[0].imageUrl || null;
      }

      // Update post
      const { error } = await supabase
        .from("posts")
        .update({
          title,
          description,
          tags: tagsArray,
          image_url: finalCoverImage,
          published,
          slug: newSlug,
          metadata: newsContent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      if (error) throw error;

      setSuccess(true);

      // Redirect after successful update
      setTimeout(() => {
        router.push(`/news/${newSlug}`);
      }, 1500);
    } catch (error) {
      console.error("Error updating news post:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImage(null);
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

  if (error && !post) {
    return (
      <main>
        <div className="container">
          <div className="error-message">{error}</div>
          <button
            className="secondary-button"
            onClick={() => router.push("/news")}
          >
            Back to News
          </button>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        <div className="post-editor news-editor">
          <h1>Edit News Post</h1>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              News post updated successfully! Redirecting...
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
              updateContent={updateNewsContent}
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
                Publish post
              </label>
              <small>Unpublished news posts will be saved as drafts</small>
            </div>

            <div className="form-group">
              <label htmlFor="coverImage">Cover Image (Optional)</label>
              <p className="field-description">
                Add a cover image if automatic extraction doesn't work or you
                prefer a custom image.
              </p>
              {/* 
                TODO: Future Design Enhancement - Post-Overhaul
                ------------------------------------------------
                Replace/supplement cover images with category-based icons:
                
                1. Add a dropdown for article categories:
                   - Technology: computer/chip icon
                   - Environment: leaf/planet icon  
                   - Policy: document/government icon
                   - Science: microscope/lab icon
                   - Art: palette/brush icon
                   - General: newspaper/info icon
                
                2. Use these icons as fallbacks when no cover image is available
                
                3. Implementation example:
                <div className="form-group">
                  <label>Article Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="technology">Technology</option>
                    <option value="environment">Environment</option>
                    <option value="policy">Policy</option>
                    <option value="science">Science</option>
                    <option value="art">Art</option>
                    <option value="general">General News</option>
                  </select>
                </div>
                
                Each category would have a corresponding SVG icon in public/images/categories/
              */}
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

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => router.push(`/news/${slug}`)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Update News Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
