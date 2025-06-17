import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";

if (isDemoMode) {
  console.log("🎯 DEMO MODE ENABLED - Supabase authentication bypassed");
  console.log("Demo credentials: demo@tradenavigator.com / demo123");
}

// In demo mode, we can skip Supabase setup
if (!isDemoMode && (!supabaseUrl || !supabaseAnonKey)) {
  console.error("Missing Supabase environment variables:", {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
  });
  throw new Error("Missing Supabase environment variables");
}

// Create a dummy client for demo mode or real client for production
export const supabase = isDemoMode
  ? null // We'll handle this in AuthContext
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
      db: {
        schema: "public",
      },
      global: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Profile": "public",
          Prefer: "return=representation",
        },
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });

// Add error handler for Supabase only if not in demo mode
if (!isDemoMode && supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      console.log("User signed out");
    } else if (event === "SIGNED_IN") {
      console.log("User signed in");
    } else if (event === "TOKEN_REFRESHED") {
      console.log("Token refreshed");
    }
  });
}

export default supabase;
