"use client";
import { useState } from "react";
import { browserSupabase } from "@dpl/supabase";
import { Logo } from "@dpl/ui";
import "../styles.css";

export const dynamic = "force-dynamic";
function siteUrl() { const origin = typeof window !== "undefined" ? window.location.origin : ""; const configured = origin || process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"; return configured.startsWith("http") ? configured.replace(/\/$/, "") : `https://${configured}`; }
function savePendingProfile(fullName: string, teamName: string) { document.cookie = `dpl_pending_profile=${encodeURIComponent(JSON.stringify({ fullName: fullName.trim(), teamName: teamName.trim() }))}; Path=/; Max-Age=900; SameSite=Lax`; }

export default function LoginPage() {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [fullName, setFullName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const google = async () => {
    if (mode === "signup" && (!fullName.trim() || !teamName.trim())) { setMessage("Enter your full name and fantasy team name first."); return; }
    if (mode === "signup") savePendingProfile(fullName, teamName);
    const { data, error } = await browserSupabase().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${siteUrl()}/auth/callback` } });
    if (error) setMessage(error.message); else if (data?.url) window.location.assign(data.url);
  };
  const magicLink = async () => { const { error } = await browserSupabase().auth.signInWithOtp({ email, options: { emailRedirectTo: `${siteUrl()}/auth/callback` } }); setMessage(error?.message ?? "Check your email for a magic link."); };
  return <main className="login"><Logo /><div className="login-card"><p className="eyebrow">DPL Fantasy · Botswana</p><h1>{mode === "signup" ? "Create your account." : "Welcome back."}</h1><p>{mode === "signup" ? "Set up your profile once, then choose your DPL fantasy squad." : "Sign in to view your saved team, points and ranking."}</p>{mode === "signup" && <><label className="login-label">Full name<input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" type="text" autoComplete="name" /></label><label className="login-label">Fantasy team name<input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="e.g. Court Vision" type="text" /></label></>}<button className="google" onClick={google}>Continue with Google</button><div className="or">or use your email</div><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" autoComplete="email" /><button className="primary" onClick={magicLink}>Send magic link</button>{message && <small>{message}</small>}<button className="login-switch" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setMessage(""); }}>{mode === "signup" ? "Already have an account? Sign in" : "New to DPL Fantasy? Create an account"}</button></div></main>;
}
