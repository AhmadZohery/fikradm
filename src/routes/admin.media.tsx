import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/media")({
  component: () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">مكتبة الوسائط</h1>
      <Card className="p-8 text-center text-muted-foreground">
        رفع وإدارة الصور قادمة قريباً
      </Card>
    </div>
  ),
});
