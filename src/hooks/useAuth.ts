import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "editor" | "viewer";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) Set up listener FIRST to avoid race conditions
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setLoading(true);
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        // Defer Supabase calls (avoid deadlocks inside callback)
        setTimeout(() => {
          void fetchRoles(sess.user.id, sess.access_token).finally(() => setLoading(false));
        }, 0);
      } else {
        setRoles([]);
        setLoading(false);
      }
    });

    // 2) Then fetch existing session
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        fetchRoles(sess.user.id, sess.access_token).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function fetchRoles(userId: string, accessToken?: string) {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    let nextRoles = (data ?? []).map((r) => r.role as AppRole);

    if (nextRoles.length === 0 && accessToken) {
      const res = await fetch("/api/admin/bootstrap-role", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const payload = (await res.json()) as { roles?: AppRole[] };
        nextRoles = Array.isArray(payload.roles) ? payload.roles : [];
      }
    }

    setRoles(nextRoles);
  }

  const isAdmin = roles.includes("admin");
  const isEditor = roles.includes("editor");
  const isStaff = isAdmin || isEditor;

  return { user, session, roles, loading, isAdmin, isEditor, isStaff };
}
