"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SECTION_LABEL, SECTION_PATH, safeImageSrc, toTags } from "@/lib/content";
import {
  LIMITS,
  POST_TYPES,
  contentProblem,
  createSlug,
  fallbackCover,
  storagePaths,
  uniqueSlug,
  uploadPostImage,
} from "@/lib/editor";
import NewsContentEditor from "./NewsContentEditor";
import EngineeringContentEditor from "./EngineeringContentEditor";
import "../../app/styles/postEditor.css";

const ArtContentEditor = dynamic(() => import("./ArtContentEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const EDITORS = {
  news: NewsContentEditor,
  art: ArtContentEditor,
  engineering: EngineeringContentEditor,
};

/**
 * One editor for every post type.
 *
 * Shared fields (title, description, tags, cover, publish) sit on top; the tab
 * chooses the type-specific section. Content for each tab is kept separately
 * and only the active tab is saved, so a news post never carries art keys.
 *
 * <PostEditor mode="create" initialType="news" />
 * <PostEditor mode="edit" initialType="art" slug="my-piece" />
 */
export default function PostEditor({ mode, initialType = "news", slug }) {
  const [supabase] = useState(() => createClient());
  const router = useRouter();
  const editing = mode === "edit";
  const here = editing ? `/write/${SECTION_PATH[initialType]}/${slug}` : `/write?type=${SECTION_PATH[initialType]}`;

  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | denied | missing
  const [post, setPost] = useState(null);

  const [type, setType] = useState(initialType);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [contents, setContents] = useState({ news: {}, art: {}, engineering: {} });

  // Cover: an explicit saved URL, a newly chosen file, or neither (automatic).
  const [coverUrl, setCoverUrl] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateRef = useRef(() => true);
  const handleValidate = useCallback((fn) => {
    validateRef.current = fn;
  }, []);
  const updateContent = useCallback(
    (content) => setContents((prev) => ({ ...prev, [type]: content })),
    [type]
  );

  // Sign-in, author allowlist (create) or ownership (edit), then load the post.
  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!active) return;
        if (!user) {
          router.push(`/login?redirect=${encodeURIComponent(here)}`);
          return;
        }
        setUserId(user.id);

        if (!editing) {
          const { data, error: authorError } = await supabase
            .from("authors")
            .select("user_id")
            .eq("user_id", user.id)
            .maybeSingle();
          if (!active) return;
          setStatus(!authorError && data ? "ready" : "denied");
          return;
        }

        const { data, error: postError } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .eq("content_type", initialType)
          .maybeSingle();
        if (!active) return;
        if (postError || !data) {
          setStatus("missing");
          return;
        }
        if (data.user_id !== user.id) {
          setStatus("denied");
          return;
        }
        setPost(data);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setTags(toTags(data.tags).join(", "));
        setPublished(Boolean(data.published));
        setContents((prev) => ({ ...prev, [initialType]: data.metadata || {} }));
        // A cover that just mirrors the automatic one stays automatic.
        const auto = fallbackCover(initialType, data.metadata);
        setCoverUrl(data.image_url && data.image_url !== auto ? data.image_url : "");
        setStatus("ready");
      } catch (err) {
        console.error("Error loading editor:", err);
        if (active) setStatus("missing");
      }
    }
    init();
    return () => {
      active = false;
    };
  }, [supabase, router, editing, initialType, slug, here]);

  // Object URLs are created when a file is chosen and released on change/unmount.
  const previewRef = useRef("");
  useEffect(() => () => URL.revokeObjectURL(previewRef.current), []);
  function chooseCover(file) {
    URL.revokeObjectURL(previewRef.current);
    previewRef.current = file ? URL.createObjectURL(file) : "";
    setCoverFile(file);
    setCoverPreview(previewRef.current);
  }

  function selectTab(next) {
    if (editing || next === type) return;
    validateRef.current = () => true;
    setType(next);
    setError(null);
    setFieldErrors({});
  }

  function onTabKeyDown(e) {
    const i = POST_TYPES.indexOf(type);
    let next = null;
    if (e.key === "ArrowRight") next = POST_TYPES[(i + 1) % POST_TYPES.length];
    if (e.key === "ArrowLeft") next = POST_TYPES[(i + POST_TYPES.length - 1) % POST_TYPES.length];
    if (e.key === "Home") next = POST_TYPES[0];
    if (e.key === "End") next = POST_TYPES[POST_TYPES.length - 1];
    if (!next) return;
    e.preventDefault();
    selectTab(next);
    document.getElementById(`tab-${next}`)?.focus();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const errors = {};
    if (!title.trim()) errors.title = "Title is required";
    else if (title.length > LIMITS.title) errors.title = `Title must be under ${LIMITS.title} characters`;
    if (!description.trim()) errors.description = "Description is required";
    else if (description.length > LIMITS.description)
      errors.description = `Description is too long (max ${LIMITS.description} characters)`;
    if (tags.length > LIMITS.tags) errors.tags = `Tags are too long (max ${LIMITS.tags} characters)`;
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!validateRef.current()) return;
    const problem = contentProblem(type, contents[type]);
    if (problem) {
      setError(problem);
      return;
    }

    setSaving(true);
    try {
      const content = contents[type];
      let image = coverUrl;
      if (coverFile) image = await uploadPostImage(supabase, userId, coverFile);
      if (!image) image = fallbackCover(type, content);

      const row = {
        title: title.trim(),
        description,
        tags: toTags(tags),
        image_url: image || null,
        published,
        metadata: content,
      };

      let finalSlug = slug;
      if (editing) {
        const { error: updateError } = await supabase
          .from("posts")
          .update({ ...row, updated_at: new Date().toISOString() })
          .eq("id", post.id);
        if (updateError) throw updateError;
      } else {
        finalSlug = await uniqueSlug(supabase, createSlug(title));
        const { error: insertError } = await supabase
          .from("posts")
          .insert({ ...row, content_type: type, user_id: userId, slug: finalSlug });
        if (insertError) throw insertError;
      }

      setSuccess(true);
      const detail = `/${SECTION_PATH[type]}/${finalSlug}`;
      setTimeout(() => {
        // Drafts stay in the editor so the work can continue.
        router.push(published ? detail : `/write/${SECTION_PATH[type]}/${finalSlug}`);
        router.refresh();
      }, 1200);
    } catch (err) {
      console.error("Error saving post:", err);
      setError(err.message || "Could not save the post");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }
    setSaving(true);
    try {
      const { error: deleteError } = await supabase.from("posts").delete().eq("id", post.id);
      if (deleteError) throw deleteError;
      const paths = storagePaths(post.metadata);
      if (paths.length > 0) await supabase.storage.from("post-images").remove(paths);
      router.push(`/${SECTION_PATH[type]}`);
      router.refresh();
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete the post");
      setSaving(false);
    }
  }

  if (status === "loading") {
    return (
      <main id="main-content">
        <div className="container">
          <div className="loading-container">
            <p>Loading editor...</p>
          </div>
        </div>
      </main>
    );
  }

  if (status !== "ready") {
    return (
      <main id="main-content">
        <div className="container">
          <div className="post-editor">
            <h1>{status === "missing" ? "Post not found" : "Not available"}</h1>
            <p>
              {status === "missing"
                ? "That post could not be loaded."
                : editing
                  ? "Only the author of this post can edit it."
                  : "Publishing is limited to SolCafe authors."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const Editor = EDITORS[type];
  const coverShown = coverPreview || safeImageSrc(coverUrl);
  const cancelHref = editing ? `/${SECTION_PATH[type]}/${slug}` : `/${SECTION_PATH[type]}`;

  return (
    <main id="main-content">
      <div className="container">
        <div className={`post-editor post-editor--${type}`}>
          <h1>{editing ? `Edit ${SECTION_LABEL[type]} post` : "Write"}</h1>

          {!editing && (
            <div className="editor-tabs" role="tablist" aria-label="Post type" onKeyDown={onTabKeyDown}>
              {POST_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  id={`tab-${t}`}
                  aria-selected={t === type}
                  aria-controls="editor-panel"
                  tabIndex={t === type ? 0 : -1}
                  className="editor-tabs__tab"
                  onClick={() => selectTab(t)}
                >
                  {SECTION_LABEL[t]}
                </button>
              ))}
            </div>
          )}

          {error && <div className="error-message" role="alert">{error}</div>}
          {success && (
            <div className="success-message" role="status">
              Saved. {published ? "Taking you to the published post..." : "Opening the draft..."}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div
              id="editor-panel"
              role={editing ? undefined : "tabpanel"}
              aria-labelledby={editing ? undefined : `tab-${type}`}
            >
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.title)}
                />
                {fieldErrors.title && <p className="error-message">{fieldErrors.title}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Short description *</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  aria-invalid={Boolean(fieldErrors.description)}
                />
                {fieldErrors.description && <p className="error-message">{fieldErrors.description}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="coverImage">Cover image</label>
                <p className="field-description">
                  Optional. Without one, the first image or link image in the post is used, or
                  stained glass if there is none. The arch crops the top corners.
                </p>
                <input
                  type="file"
                  id="coverImage"
                  accept="image/*"
                  onChange={(e) => chooseCover(e.target.files?.[0] || null)}
                />
                {coverShown && (
                  <div className="image-preview">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverShown} alt="Cover preview" />
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => {
                        chooseCover(null);
                        setCoverUrl("");
                      }}
                    >
                      Remove cover
                    </button>
                  </div>
                )}
              </div>

              <Editor
                key={type}
                content={contents[type]}
                updateContent={updateContent}
                userId={userId}
                onValidate={handleValidate}
              />

              <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Comma-separated, e.g. solar, wind, alberta"
                  aria-invalid={Boolean(fieldErrors.tags)}
                />
                {fieldErrors.tags && <p className="error-message">{fieldErrors.tags}</p>}
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                  />
                  Published
                </label>
                <small>Unpublished posts are saved as drafts, visible only to you.</small>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="secondary-button" onClick={() => router.push(cancelHref)}>
                Cancel
              </button>
              {editing && (
                <button type="button" className="secondary-button" onClick={handleDelete} disabled={saving}>
                  Delete
                </button>
              )}
              <button type="submit" className="primary-button" disabled={saving}>
                {saving ? "Saving..." : editing ? "Save changes" : "Save post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
