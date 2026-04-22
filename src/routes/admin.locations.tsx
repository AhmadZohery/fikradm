import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/locations")({
  component: () => (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">إدارة المواقع الجغرافية</h1>
        <p className="text-sm text-muted-foreground mt-1">صفحات المدن للسيو المحلي. قاعدة البيانات جاهزة.</p>
      </div>
      <Card className="p-8 text-center text-muted-foreground">واجهة إدارة المواقع قادمة في الدفعة التالية.</Card>
    </div>
  ),
});