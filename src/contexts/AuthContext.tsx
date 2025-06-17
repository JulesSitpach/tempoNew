import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if we're in demo mode
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";

  useEffect(() => {
    console.log("🔐 AuthProvider useEffect running, isDemoMode:", isDemoMode);

    // If in demo mode, skip Supabase and set up demo user
    if (isDemoMode) {
      console.log("🚀 Running in DEMO MODE - Authentication bypassed");
      const savedDemoUser = localStorage.getItem("demoUser");
      if (savedDemoUser) {
        console.log("📦 Found saved demo user in localStorage");
        const demoUser = JSON.parse(savedDemoUser);
        setUser(demoUser);
        setSession({
          user: demoUser,
          access_token: "demo-token",
          expires_at: Date.now() + 86400000, // 24 hours from now
        } as Session);
      } else {
        console.log("👤 No saved demo user found");
      }
      setLoading(false);
      return;
    }

    // Original Supabase logic for production
    const getSession = async () => {
      try {
        if (!supabase) {
          setLoading(false);
          return;
        }
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error("Unexpected error getting session:", error);
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes only if supabase is available
    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        try {
          console.log("Auth state changed:", event);
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        } catch (error) {
          console.error("Error in auth state change:", error);
          setLoading(false);
        }
      });

      return () => {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from auth changes:", error);
        }
      };
    }
  }, [isDemoMode]);

  const signUp = async (email: string, password: string) => {
    if (isDemoMode) {
      // Demo mode signup
      const demoUser = {
        id: "demo-user-" + Date.now(),
        email: email,
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
      } as User;

      localStorage.setItem("demoUser", JSON.stringify(demoUser));
      setUser(demoUser);
      setSession({
        user: demoUser,
        access_token: "demo-token",
        expires_at: Date.now() + 86400000,
      } as Session);

      return { error: null };
    }

    try {
      if (supabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        return { error };
      }
      return { error: { message: "Supabase not configured" } };
    } catch (error) {
      console.error("Unexpected error in signUp:", error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (isDemoMode) {
      // Demo mode signin - accept demo credentials or any email/password
      const demoEmail =
        import.meta.env.VITE_DEMO_EMAIL || "demo@tradenavigator.com";
      const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || "demo123";

      if (
        (email === demoEmail && password === demoPassword) ||
        (email.includes("@") && password.length >= 3)
      ) {
        const demoUser = {
          id: "demo-user-authenticated",
          email: email,
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          aud: "authenticated",
        } as User;

        localStorage.setItem("demoUser", JSON.stringify(demoUser));
        setUser(demoUser);
        setSession({
          user: demoUser,
          access_token: "demo-token",
          expires_at: Date.now() + 86400000,
        } as Session);

        return { error: null };
      } else {
        return {
          error: {
            message:
              "Invalid demo credentials. Try: demo@tradenavigator.com / demo123",
          },
        };
      }
    }

    try {
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { error };
      }
      return { error: { message: "Supabase not configured" } };
    } catch (error) {
      console.error("Unexpected error in signIn:", error);
      return { error };
    }
  };

  const signOut = async () => {
    if (isDemoMode) {
      localStorage.removeItem("demoUser");
      setUser(null);
      setSession(null);
      return;
    }

    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
