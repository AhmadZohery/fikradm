import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/settings")({
  component: () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">الإعدادات</h1>
      <Card className="p-8 text-center text-muted-foreground">
        إعدادات الموقع العامة قادمة قريباً
      </Card>
    </div>
  ),
});
