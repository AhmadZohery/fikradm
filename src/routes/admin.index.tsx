import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Image as ImageIcon, Inbox, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

type Stats = {
  pages: number;
  media: number;
  submissions: number;
  views: number;
};

function Dashboard() {
  const [stats, setStats] = useState<Stats>({ pages: 0, media: 0, submissions: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [pages, media, submissions, views] = await Promise.all([
        supabase.from("pages").select("*", { count: "exact", head: true }),
        supabase.from("media_library").select("*", { count: "exact", head: true }),
        supabase.from("form_submissions").select("*", { count: "exact", head: true }),
        supabase.from("page_views").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        pages: pages.count ?? 0,
        media: media.count ?? 0,
        submissions: submissions.count ?? 0,
        views: views.count ?? 0,
      });
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: "الصفحات", value: stats.pages, icon: FileText, color: "text-blue-500" },
    { label: "ملفات الوسائط", value: stats.media, icon: ImageIcon, color: "text-purple-500" },
    { label: "الرسائل", value: stats.submissions, icon: Inbox, color: "text-amber-500" },
    { label: "مشاهدات الصفحات", value: stats.views, icon: Eye, color: "text-emerald-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground mt-1">
          مرحباً بك في لوحة تحكم فكرة. هذه الصفحة هي البداية — سيتم إضافة المزيد من المزايا في المراحل التالية.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{c.label}</div>
                <div className="text-3xl font-bold mt-2">
                  {loading ? "—" : c.value.toLocaleString("ar-EG")}
                </div>
              </div>
              <c.icon className={`w-6 h-6 ${c.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="font-semibold mb-2">المراحل القادمة</h2>
        <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pr-5">
          <li>Phase 2: نظام البلوكات و Renderer للموقع العام</li>
          <li>Phase 3: Block Builder بـ drag &amp; drop</li>
          <li>Phase 4: Tiptap Editor + SEO Panel متقدم</li>
          <li>Phase 5: Analytics تفاعلية + Live activity</li>
        </ul>
      </Card>
    </div>
  );
}
