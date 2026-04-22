import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/services")({
  component: () => (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">إدارة الخدمات</h1>
        <p className="text-sm text-muted-foreground mt-1">قاعدة البيانات جاهزة (services + sub_services). واجهة الـ CRUD التفصيلية بتيجي في الدفعة الجاية.</p>
      </div>
      <Card className="p-8 text-center text-muted-foreground">واجهة إدارة الخدمات والخدمات الفرعية قادمة في الدفعة التالية.</Card>
    </div>
  ),
});