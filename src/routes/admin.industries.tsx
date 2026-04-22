import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/industries")({
  component: () => (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">إدارة الصناعات</h1>
        <p className="text-sm text-muted-foreground mt-1">قاعدة البيانات جاهزة (industries + sub_industries). الواجهة قادمة.</p>
      </div>
      <Card className="p-8 text-center text-muted-foreground">واجهة إدارة الصناعات قادمة في الدفعة التالية.</Card>
    </div>
  ),
});