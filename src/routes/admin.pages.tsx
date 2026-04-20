import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/pages")({
  component: () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">الصفحات</h1>
      <Card className="p-8 text-center text-muted-foreground">
        قائمة الصفحات + Block Builder قادمة في Phase 2 و Phase 3
      </Card>
    </div>
  ),
});
