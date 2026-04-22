import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/blog")({
  component: () => (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">إدارة المدونة</h1>
        <p className="text-sm text-muted-foreground mt-1">قاعدة البيانات جاهزة (blog_categories + blog_posts بكل حقول الـ SEO والمحتوى المنظم). الواجهة الكاملة قادمة.</p>
      </div>
      <Card className="p-8 text-center text-muted-foreground">محرر المقالات الكامل (TOC + الأقسام + FAQ + SEO) قادم في الدفعة التالية.</Card>
    </div>
  ),
});