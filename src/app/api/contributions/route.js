import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST(req) {
  const cookieStore = await cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: { headers: { Cookie: cookieStore.toString() } },
    }
  );

  // Securely get the user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // Parse request body
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
    });
  }

  const { content, type, title } = body || {};

  // Check for all required fields
  if (!content || !type || !title) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  // Insert contribution
  const { data, error } = await supabase
    .from("contributions")
    .insert({ profile_id: user.id, content, type, title })
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true, data }), { status: 201 });
}

export async function GET(req) {
  const cookieStore = await cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: { headers: { Cookie: cookieStore.toString() } },
    }
  );

  // Securely get the user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // Fetch all contributions for the authenticated user
  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("profile_id", user.id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ contributions: data }), { status: 200 });
}

export async function PATCH(req) {
  const cookieStore = await cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: { headers: { Cookie: cookieStore.toString() } },
    }
  );

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();
  const { id, content, type, title } = body || {};
  if (!id || !content || !type || !title) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  // Fetch user's profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role_id")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role_id === 4;

  // Only allow editing if admin or owner
  const match = isAdmin ? { id } : { id, profile_id: user.id };

  const { data, error } = await supabase
    .from("contributions")
    .update({ content, type, title })
    .match(match)
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ data }), { status: 200 });
}

export async function DELETE(req) {
  const cookieStore = await cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: { headers: { Cookie: cookieStore.toString() } },
    }
  );

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();
  const { id } = body || {};
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing contribution id" }), {
      status: 400,
    });
  }

  // Fetch user's profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role_id")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role_id === 4;

  // Only allow deleting if admin or owner
  const match = isAdmin ? { id } : { id, profile_id: user.id };

  const { error } = await supabase
    .from("contributions")
    .delete()
    .match(match);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
