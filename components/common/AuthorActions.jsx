"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Author-only controls rendered inside server pages.
 *
 * <AuthorActions createHref="/write?type=news" createLabel="New news post" />
 *   Shows a create button to users on the public.authors allowlist.
 *
 * <AuthorActions post={{ id, slug, user_id }} editHref=... afterDeleteHref=... />
 *   Shows Edit / Delete to the post's owner.
 *
 * The database (RLS) is the real gate; this only hides UI that would fail.
 */
export default function AuthorActions({
  createHref,
  createLabel = "New post",
  post,
  editHref,
  afterDeleteHref = "/",
  noun = "post",
}) {
  const [supabase] = useState(() => createClient());
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;
      if (post) return user.id === post.user_id;
      // Create: only allowlisted authors (see supabase/migrations phase0_security)
      const { data, error } = await supabase
        .from("authors")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      return !error && Boolean(data);
    }

    check()
      .then((ok) => {
        if (active) setAllowed(ok);
      })
      .catch(() => {
        if (active) setAllowed(false);
      });

    return () => {
      active = false;
    };
  }, [supabase, post]);

  if (!allowed) return null;

  if (!post) {
    return (
      <Link href={createHref} className="btn btn--primary btn--sm">
        {createLabel}
      </Link>
    );
  }

  async function handleDelete() {
    if (
      !confirm(
        `Are you sure you want to delete this ${noun}? This action cannot be undone.`
      )
    ) {
      return;
    }
    setDeleting(true);
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) {
      console.error(`Error deleting ${noun}:`, error);
      alert(`Failed to delete ${noun}. Please try again.`);
      setDeleting(false);
      return;
    }
    router.push(afterDeleteHref);
    router.refresh();
  }

  return (
    <div className="author-actions" role="group" aria-label="Author actions">
      <Link href={editHref} className="btn btn--secondary btn--sm">
        Edit
      </Link>
      <button
        type="button"
        className="btn btn--danger btn--sm"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
