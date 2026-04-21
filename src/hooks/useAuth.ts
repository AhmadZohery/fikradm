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
    let mounted = true;

    async function syncRoles(sess: Session | null) {
      if (!mounted) return;
      setSession(sess);
      setUser(sess?.user ?? null);

      if (!sess?.user) {
        setRoles([]);
        setLoading(false);
        return;
      }

      try {
        const nextRoles = await fetchRoles(sess.user.id, sess.access_token);
        if (!mounted) return;
        setRoles(nextRoles);
      } catch {
        if (!mounted) return;
        setRoles([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    // 1) Listener FIRST to avoid race conditions; defer fetch to next tick.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (!mounted) return;
      setSession(sess);
      setUser(sess?.user ?? null);
      setTimeout(() => void syncRoles(sess), 0);
    });

    // 2) Then fetch existing session.
    void supabase.auth.getSession().then(({ data: { session: sess } }) => syncRoles(sess));

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function fetchRoles(userId: string, accessToken?: string): Promise<AppRole[]> {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    const existing = (data ?? []).map((r) => r.role as AppRole);
    if (existing.length > 0 || !accessToken) return existing;

    // First sign-in / no roles yet → try bootstrapping the very first admin.
    try {
      const res = await fetch("/api/admin/bootstrap-role", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return existing;
      const payload = (await res.json()) as { roles?: AppRole[] };
      return Array.isArray(payload.roles) ? (payload.roles as AppRole[]) : existing;
    } catch {
      return existing;
    }
  }

  const isAdmin = roles.includes("admin");
  const isEditor = roles.includes("editor");
  const isStaff = isAdmin || isEditor;

  return { user, session, roles, loading, isAdmin, isEditor, isStaff };
}
