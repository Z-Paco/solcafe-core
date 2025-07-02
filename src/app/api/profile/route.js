import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

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

  // Fetch the user's profile to get their role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return new Response(JSON.stringify({ error: profileError.message }), {
      status: 500,
    });
  }

  // Allow admin to fetch any profile by id param, otherwise only their own
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const isAdmin = profile.role_id === 4; // 4 = admin role_id
  const profileIdToFetch = isAdmin && id ? id : user.id;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileIdToFetch)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ profile: data }), { status: 200 });
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

  // Fetch the user's profile to get their role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return new Response(JSON.stringify({ error: profileError.message }), {
      status: 500,
    });
  }

  const body = await req.json();
  const { id, name, role_id } = body;

  const isAdmin = profile.role_id === 4; // 4 = admin role_id
  // Only admins can edit other users' profiles
  const profileIdToUpdate = isAdmin && id ? id : user.id;

  if (!name) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  // Only allow admins to update role_id
  const updates = { name };
  if (isAdmin && role_id !== undefined) {
    updates.role_id = role_id;
  }
  // Normal users cannot update role_id

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", profileIdToUpdate)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ profile: data }), { status: 200 });
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

  // Fetch the user's profile to get their role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return new Response(JSON.stringify({ error: profileError.message }), {
      status: 500,
    });
  }

  // Only admins can delete profiles
  const isAdmin = profile.role_id === 4; // 4 = admin role_id
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  // Get the id to delete from the request body
  const body = await req.json();
  const { id } = body;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing profile id" }), {
      status: 400,
    });
  }

  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
