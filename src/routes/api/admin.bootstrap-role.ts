import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/api/admin/bootstrap-role")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";

        if (!token) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

        if (!supabaseUrl || !supabasePublishableKey) {
          return Response.json({ error: "Server configuration error" }, { status: 500 });
        }

        const userClient = createClient<Database>(supabaseUrl, supabasePublishableKey, {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          auth: {
            storage: undefined,
            persistSession: false,
            autoRefreshToken: false,
          },
        });

        const {
          data: { user },
          error: userError,
        } = await userClient.auth.getUser(token);

        if (userError || !user) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { count: totalRoles, error: totalRolesError } = await supabaseAdmin
          .from("user_roles")
          .select("id", { count: "exact", head: true });

        if (totalRolesError) {
          return Response.json({ error: totalRolesError.message }, { status: 500 });
        }

        let bootstrapped = false;

        if ((totalRoles ?? 0) === 0) {
          const { error: insertError } = await supabaseAdmin.from("user_roles").upsert(
            {
              user_id: user.id,
              role: "admin",
            },
            { onConflict: "user_id,role" },
          );

          if (insertError) {
            return Response.json({ error: insertError.message }, { status: 500 });
          }

          bootstrapped = true;
        }

        const { data: rolesData, error: rolesError } = await supabaseAdmin
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        if (rolesError) {
          return Response.json({ error: rolesError.message }, { status: 500 });
        }

        return Response.json({
          bootstrapped,
          roles: (rolesData ?? []).map((row) => row.role),
        });
      },
    },
  },
});