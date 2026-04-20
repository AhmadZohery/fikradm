import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/forms")({
  component: () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">الرسائل</h1>
      <Card className="p-8 text-center text-muted-foreground">
        صندوق رسائل فورمات التواصل قادم قريباً
      </Card>
    </div>
  ),
});
