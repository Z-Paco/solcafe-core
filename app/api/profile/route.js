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

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
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

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();
  const { name } = body;

  if (!name) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ name })
    .eq("id", user.id)
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

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

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
