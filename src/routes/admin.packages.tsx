import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Loader2, Star, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/packages")({
  component: PackagesAdmin,
});

type Pkg = {
  id: string;
  slug: string;
  icon: string;
  name_ar: string;
  name_en: string;
  tagline_ar: string | null;
  tagline_en: string | null;
  best_for_ar: string | null;
  best_for_en: string | null;
  price_sar: number;
  original_price_sar: number;
  includes_ar: string[];
  includes_en: string[];
  is_popular: boolean;
  is_published: boolean;
  sort_order: number;
  cta_href: string;
};

function PackagesAdmin() {
  const [items, setItems] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await supabase.from("packages").select("*").order("sort_order");
    if (error) toast.error("فشل التحميل");
    else setItems(((data as unknown) as Pkg[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = (id: string, patch: Partial<Pkg>) => {
    setItems((p) => p.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const save = async (p: Pkg) => {
    setSavingId(p.id);
    const { error } = await supabase.from("packages").update({
      slug: p.slug, icon: p.icon, name_ar: p.name_ar, name_en: p.name_en,
      tagline_ar: p.tagline_ar, tagline_en: p.tagline_en,
      best_for_ar: p.best_for_ar, best_for_en: p.best_for_en,
      price_sar: p.price_sar, original_price_sar: p.original_price_sar,
      includes_ar: p.includes_ar as never, includes_en: p.includes_en as never,
      is_popular: p.is_popular, is_published: p.is_published,
      sort_order: p.sort_order, cta_href: p.cta_href,
    }).eq("id", p.id);
    setSavingId(null);
    if (error) toast.error("فشل الحفظ: " + error.message);
    else toast.success("تم الحفظ");
  };

  const addNew = async () => {
    const sort = items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) + 10 : 10;
    const { data, error } = await supabase.from("packages").insert({
      slug: `package-${Date.now()}`, icon: "Sparkles",
      name_ar: "باقة جديدة", name_en: "New Package",
      price_sar: 0, original_price_sar: 0, sort_order: sort,
    }).select().single();
    if (error) return toast.error("فشل الإضافة: " + error.message);
    if (data) setItems([...items, (data as unknown) as Pkg]);
    toast.success("تم إضافة باقة جديدة — اكمل تعبئة الحقول");
  };

  const remove = async (id: string) => {
    if (!confirm("حذف هذه الباقة نهائياً؟")) return;
    const { error } = await supabase.from("packages").delete().eq("id", id);
    if (error) return toast.error("فشل الحذف");
    setItems(items.filter((i) => i.id !== id));
    toast.success("تم الحذف");
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= items.length) return;
    const a = items[idx], b = items[swap];
    const newItems = [...items];
    newItems[idx] = { ...a, sort_order: b.sort_order };
    newItems[swap] = { ...b, sort_order: a.sort_order };
    setItems(newItems.sort((x, y) => x.sort_order - y.sort_order));
    await Promise.all([
      supabase.from("packages").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("packages").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة الباقات</h1>
          <p className="text-sm text-muted-foreground mt-1">باقات الأسعار اللي بتظهر في الصفحة الرئيسية. التغييرات تنعكس فوراً.</p>
        </div>
        <Button onClick={addNew}><Plus className="w-4 h-4 ml-2" /> باقة جديدة</Button>
      </div>

      {items.length === 0 && (
        <Card className="p-12 text-center text-muted-foreground">لا توجد باقات بعد — اضغط "باقة جديدة"</Card>
      )}

      <div className="space-y-4">
        {items.map((p, idx) => (
          <Card key={p.id} className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0" disabled={idx === 0} onClick={() => move(p.id, -1)}><ArrowUp className="w-3 h-3" /></Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0" disabled={idx === items.length - 1} onClick={() => move(p.id, 1)}><ArrowDown className="w-3 h-3" /></Button>
                </div>
                <div>
                  <div className="font-bold text-lg flex items-center gap-2">
                    {p.name_ar || "(بدون اسم)"}
                    {p.is_popular && <Badge className="bg-primary"><Star className="w-3 h-3 ml-1" /> الأكثر طلباً</Badge>}
                    {!p.is_published && <Badge variant="outline">مخفية</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">{p.slug}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-xs"><Label className="text-xs">منشورة</Label><Switch checked={p.is_published} onCheckedChange={(v) => update(p.id, { is_published: v })} /></div>
                <div className="flex items-center gap-2 text-xs"><Label className="text-xs">الأكثر طلباً</Label><Switch checked={p.is_popular} onCheckedChange={(v) => update(p.id, { is_popular: v })} /></div>
                <Button size="sm" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="المعرّف (slug)" value={p.slug} onChange={(v) => update(p.id, { slug: v })} />
              <Field label="الأيقونة (Lucide)" value={p.icon} onChange={(v) => update(p.id, { icon: v })} placeholder="Sparkles | Rocket | Crown" />
              <Field label="الاسم (عربي)" value={p.name_ar} onChange={(v) => update(p.id, { name_ar: v })} />
              <Field label="الاسم (English)" value={p.name_en} onChange={(v) => update(p.id, { name_en: v })} />
              <Field label="السطر التعريفي (عربي)" value={p.tagline_ar || ""} onChange={(v) => update(p.id, { tagline_ar: v })} />
              <Field label="السطر التعريفي (English)" value={p.tagline_en || ""} onChange={(v) => update(p.id, { tagline_en: v })} />
              <Field label="مناسبة لـ (عربي)" value={p.best_for_ar || ""} onChange={(v) => update(p.id, { best_for_ar: v })} />
              <Field label="مناسبة لـ (English)" value={p.best_for_en || ""} onChange={(v) => update(p.id, { best_for_en: v })} />
              <NumField label="السعر (SAR)" value={p.price_sar} onChange={(v) => update(p.id, { price_sar: v })} />
              <NumField label="السعر الأصلي قبل الخصم (SAR)" value={p.original_price_sar} onChange={(v) => update(p.id, { original_price_sar: v })} />
              <Field label="رابط زر CTA" value={p.cta_href} onChange={(v) => update(p.id, { cta_href: v })} placeholder="/contact" />
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4">
              <ListField label="الميزات (عربي — كل سطر بند)" value={p.includes_ar || []} onChange={(v) => update(p.id, { includes_ar: v })} />
              <ListField label="الميزات (English — one per line)" value={p.includes_en || []} onChange={(v) => update(p.id, { includes_en: v })} />
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => save(p)} disabled={savingId === p.id}>
                {savingId === p.id ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
                حفظ
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <div className="space-y-1.5"><Label className="text-xs font-medium">{label}</Label><Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></div>;
}
function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return <div className="space-y-1.5"><Label className="text-xs font-medium">{label}</Label><Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} /></div>;
}
function ListField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <Textarea rows={7} value={(value || []).join("\n")} onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} />
    </div>
  );
}