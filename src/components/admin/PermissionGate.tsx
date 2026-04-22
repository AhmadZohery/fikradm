import { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { usePermissions, type Permission, hasPermission } from "@/hooks/usePermissions";
import { Card } from "@/components/ui/card";

interface PermissionGateProps {
  /** Required permission to render children. */
  perm: Permission;
  children: ReactNode;
  /** Custom fallback. Defaults to a friendly "no access" card. */
  fallback?: ReactNode;
  /** Render nothing instead of a fallback when access denied. */
  hideOnDeny?: boolean;
}

/**
 * Conditionally render children based on the current user's permission.
 * Use to wrap action buttons (Save / Delete / Invite) so viewers
 * never see destructive UI.
 */
export function PermissionGate({ perm, children, fallback, hideOnDeny }: PermissionGateProps) {
  const { roles, loading } = usePermissions();
  if (loading) return null;
  if (!hasPermission(roles, perm)) {
    if (hideOnDeny) return null;
    return (
      fallback ?? (
        <Card className="flex items-start gap-3 border-dashed bg-muted/30 p-4 text-sm">
          <ShieldAlert className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">لا توجد صلاحية كافية</div>
            <p className="text-muted-foreground">
              صلاحيتك الحالية للقراءة فقط. تواصل مع المسؤول للترقية.
            </p>
          </div>
        </Card>
      )
    );
  }
  return <>{children}</>;
}

/**
 * Lightweight inline read-only banner for editor pages when viewer opens them.
 */
export function ReadOnlyBanner() {
  const { isViewer } = usePermissions();
  if (!isViewer) return null;
  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200/60 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
      <ShieldAlert className="h-3.5 w-3.5" />
      وضع القراءة فقط — لن تتمكّن من الحفظ أو الحذف بصلاحيتك الحالية (viewer).
    </div>
  );
}