import { useAuth, type AppRole } from "./useAuth";

/**
 * Centralized RBAC helper.
 *
 * - admin   → full access (CRUD + manage users + settings)
 * - editor  → CRUD on content (services / blog / pages / media / forms)
 * - viewer  → read-only access to admin dashboard, no editor / no CRUD
 */
export function usePermissions() {
  const { roles, loading, isAdmin, isEditor, isStaff, user } = useAuth();

  const isViewer = !loading && !!user && roles.includes("viewer") && !isStaff;

  // Content rights
  const canEditContent = isAdmin || isEditor;
  const canDeleteContent = isAdmin || isEditor;
  const canPublishContent = isAdmin || isEditor;

  // System rights (admin only)
  const canManageUsers = isAdmin;
  const canManageSettings = isAdmin;
  const canViewSeoAudit = isStaff;

  // Read access — anyone signed-in with a known role can browse admin
  const canAccessAdmin = !loading && (isStaff || isViewer);

  return {
    loading,
    roles,
    isAdmin,
    isEditor,
    isViewer,
    isStaff,
    canEditContent,
    canDeleteContent,
    canPublishContent,
    canManageUsers,
    canManageSettings,
    canViewSeoAudit,
    canAccessAdmin,
  };
}

export type Permission =
  | "edit_content"
  | "delete_content"
  | "publish_content"
  | "manage_users"
  | "manage_settings"
  | "view_seo_audit";

export function hasPermission(roles: AppRole[], perm: Permission): boolean {
  const isAdmin = roles.includes("admin");
  const isEditor = roles.includes("editor");
  switch (perm) {
    case "edit_content":
    case "delete_content":
    case "publish_content":
      return isAdmin || isEditor;
    case "manage_users":
    case "manage_settings":
      return isAdmin;
    case "view_seo_audit":
      return isAdmin || isEditor;
    default:
      return false;
  }
}