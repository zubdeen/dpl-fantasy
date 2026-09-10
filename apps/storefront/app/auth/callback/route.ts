import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverSupabase } from "@dpl/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const client = await serverSupabase();
  const code = url.searchParams.get("code");
  if (code) await client.auth.exchangeCodeForSession(code);
  const { data: { user } } = await client.auth.getUser();
  const cookieStore = await cookies();
  const pending = cookieStore.get("dpl_pending_profile")?.value;
  if (user && pending) {
    try {
      const profile = JSON.parse(decodeURIComponent(pending)) as { fullName?: string; teamName?: string };
      if (profile.fullName?.trim() && profile.teamName?.trim()) {
        await client.from("fantasy_managers").upsert({ id: user.id, actual_name: profile.fullName.trim(), team_name: profile.teamName.trim() }, { onConflict: "id" });
      }
    } catch {}
  }
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.delete("dpl_pending_profile");
  return response;
}
