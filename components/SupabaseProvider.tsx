"use client";

import { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export default function SupabaseProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const [supabaseClient] = useState(() => createClient());
  void supabaseClient;
  void session;

  return <>{children}</>;
}
