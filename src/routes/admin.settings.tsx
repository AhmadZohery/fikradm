import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, Plus, Trash2, GripVertical, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { refreshSiteSettings } from "@/hooks/useSiteSettings";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

type Row = { key: string; data: Record<string, unknown> };

function SettingsPage() {
  const [rows, setRows] = useState<Record<string, Row["data"]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("site_settings").select("key, data");
      if (error) {
        toast.error("تعذّر تحميل الإعدادات");
      } else if (data) {
        const out: Record<string, Row["data"]> = {};
        for (const r of data) out[r.key] = (r.data as Row["data"]) || {};
        setRows(out);
      }
      setLoading(false);
    })();
  }, []);

  const save = async (key: string) => {
    setSaving(key);
    const { error } = await supabase
      .from("site_settings")
      .update({ data: rows[key] })
      .eq("key", key);
    setSaving(null);
    if (error) {
      toast.error("فشل الحفظ: " + error.message);
    } else {
      toast.success("تم الحفظ");
      await refreshSiteSettings();
    }
  };

  const update = (key: string, patch: Record<string, unknown>) => {
    setRows((prev) => ({ ...prev, [key]: { ...(prev[key] || {}), ...patch } }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">الإعدادات العامة</h1>
        <p className="text-sm text-muted-foreground mt-1">
          إدارة معلومات التواصل، شريط الإعلانات، القوائم وهوية الموقع — تنعكس فوراً على الموقع.
        </p>
      </div>

      <Tabs defaultValue="contact">
        <TabsList>
          <TabsTrigger value="contact">التواصل</TabsTrigger>
          <TabsTrigger value="announcement">شريط الإعلانات</TabsTrigger>
          <TabsTrigger value="navigation">القائمة الرئيسية</TabsTrigger>
          <TabsTrigger value="brand">هوية الموقع</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="mt-4">
          <ContactTab data={rows.contact || {}} update={(p) => update("contact", p)} onSave={() => save("contact")} saving={saving === "contact"} />
        </TabsContent>
        <TabsContent value="announcement" className="mt-4">
          <AnnouncementTab data={rows.announcement || {}} update={(p) => update("announcement", p)} onSave={() => save("announcement")} saving={saving === "announcement"} />
        </TabsContent>
        <TabsContent value="navigation" className="mt-4">
          <NavigationTab data={rows.navigation || {}} update={(p) => update("navigation", p)} onSave={() => save("navigation")} saving={saving === "navigation"} />
        </TabsContent>
        <TabsContent value="brand" className="mt-4">
          <BrandTab data={rows.brand || {}} update={(p) => update("brand", p)} onSave={() => save("brand")} saving={saving === "brand"} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------- CONTACT ---------- */
function ContactTab({ data, update, onSave, saving }: { data: Record<string, unknown>; update: (p: Record<string, unknown>) => void; onSave: () => void; saving: boolean }) {
  const v = data as Record<string, string>;
  return (
    <Card className="p-6 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="رقم الواتساب (مع +)" value={v.whatsapp || ""} onChange={(x) => update({ whatsapp: x })} placeholder="+966500000000" />
        <Field label="رقم الهاتف (مع +)" value={v.phone || ""} onChange={(x) => update({ phone: x })} placeholder="+966500000000" />
        <Field label="البريد الإلكتروني" value={v.email || ""} onChange={(x) => update({ email: x })} placeholder="hello@fikra.sa" />
        <div />
        <Field label="العنوان (عربي)" value={v.address_ar || ""} onChange={(x) => update({ address_ar: x })} />
        <Field label="العنوان (إنجليزي)" value={v.address_en || ""} onChange={(x) => update({ address_en: x })} />
        <Field label="ساعات العمل (عربي)" value={v.working_hours_ar || ""} onChange={(x) => update({ working_hours_ar: x })} />
        <Field label="ساعات العمل (إنجليزي)" value={v.working_hours_en || ""} onChange={(x) => update({ working_hours_en: x })} />
      </div>
      <SaveBar onSave={onSave} saving={saving} />
    </Card>
  );
}

/* ---------- ANNOUNCEMENT ---------- */
type Msg = { icon: string; ar: string; en: string; cta_ar?: string; cta_en?: string; href?: string };
function AnnouncementTab({ data, update, onSave, saving }: { data: Record<string, unknown>; update: (p: Record<string, unknown>) => void; onSave: () => void; saving: boolean }) {
  const enabled = Boolean(data.enabled);
  const messages = (data.messages as Msg[]) || [];
  const setMessages = (m: Msg[]) => update({ messages: m });
  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">تفعيل الشريط</Label>
          <p className="text-xs text-muted-foreground mt-1">عند الإيقاف يختفي الشريط من الموقع.</p>
        </div>
        <Switch checked={enabled} onCheckedChange={(v) => update({ enabled: v })} />
      </div>
      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">الرسائل المتغيرة</h3>
          <Button size="sm" variant="outline" onClick={() => setMessages([...messages, { icon: "Sparkles", ar: "", en: "", cta_ar: "", cta_en: "", href: "/contact" }])}>
            <Plus className="w-3.5 h-3.5 ml-1" /> إضافة رسالة
          </Button>
        </div>
        {messages.length === 0 && (
          <div className="text-sm text-muted-foreground py-6 text-center bg-muted/30 rounded-lg">لا توجد رسائل بعد</div>
        )}
        {messages.map((m, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3 bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <GripVertical className="w-3.5 h-3.5" /> رسالة #{i + 1}
              </div>
              <Button size="sm" variant="ghost" onClick={() => setMessages(messages.filter((_, j) => j !== i))}>
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="الأيقونة" value={m.icon} onChange={(x) => setMessages(messages.map((mm, j) => j === i ? { ...mm, icon: x } : mm))} placeholder="Sparkles | Gift | Phone | Megaphone | Star | Bell | Zap" />
              <Field label="الرابط" value={m.href || ""} onChange={(x) => setMessages(messages.map((mm, j) => j === i ? { ...mm, href: x } : mm))} placeholder="/contact" />
              <Field label="النص (عربي)" value={m.ar} onChange={(x) => setMessages(messages.map((mm, j) => j === i ? { ...mm, ar: x } : mm))} />
              <Field label="النص (English)" value={m.en} onChange={(x) => setMessages(messages.map((mm, j) => j === i ? { ...mm, en: x } : mm))} />
              <Field label="زر CTA (عربي)" value={m.cta_ar || ""} onChange={(x) => setMessages(messages.map((mm, j) => j === i ? { ...mm, cta_ar: x } : mm))} />
              <Field label="زر CTA (English)" value={m.cta_en || ""} onChange={(x) => setMessages(messages.map((mm, j) => j === i ? { ...mm, cta_en: x } : mm))} />
            </div>
          </div>
        ))}
      </div>
      <SaveBar onSave={onSave} saving={saving} />
    </Card>
  );
}

/* ---------- NAVIGATION ---------- */
type NavL = { ar: string; en: string; href: string };
function NavigationTab({ data, update, onSave, saving }: { data: Record<string, unknown>; update: (p: Record<string, unknown>) => void; onSave: () => void; saving: boolean }) {
  const header = (data.header as NavL[]) || [];
  const setHeader = (h: NavL[]) => update({ header: h });
  return (
    <Card className="p-6 space-y-5">
      <div>
        <h3 className="font-semibold text-sm mb-1">روابط القائمة الرئيسية (Header)</h3>
        <p className="text-xs text-muted-foreground">الترتيب من الأعلى للأسفل. حالياً تستخدم القائمة الافتراضية كبديل احتياطي إذا تم حذف كل الروابط.</p>
      </div>
      <div className="space-y-2">
        {header.map((l, i) => (
          <div key={i} className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end p-3 rounded-lg border bg-muted/20">
            <Field label={i === 0 ? "النص (عربي)" : ""} value={l.ar} onChange={(x) => setHeader(header.map((ll, j) => j === i ? { ...ll, ar: x } : ll))} />
            <Field label={i === 0 ? "النص (English)" : ""} value={l.en} onChange={(x) => setHeader(header.map((ll, j) => j === i ? { ...ll, en: x } : ll))} />
            <Field label={i === 0 ? "الرابط" : ""} value={l.href} onChange={(x) => setHeader(header.map((ll, j) => j === i ? { ...ll, href: x } : ll))} />
            <Button size="sm" variant="ghost" onClick={() => setHeader(header.filter((_, j) => j !== i))}>
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </Button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={() => setHeader([...header, { ar: "", en: "", href: "/" }])}>
          <Plus className="w-3.5 h-3.5 ml-1" /> إضافة رابط
        </Button>
      </div>
      <SaveBar onSave={onSave} saving={saving} />
    </Card>
  );
}

/* ---------- BRAND ---------- */
function BrandTab({ data, update, onSave, saving }: { data: Record<string, unknown>; update: (p: Record<string, unknown>) => void; onSave: () => void; saving: boolean }) {
  const v = data as Record<string, string | Record<string, string>>;
  const social = (v.social as Record<string, string>) || {};
  return (
    <Card className="p-6 space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="رابط اللوجو (URL)" value={(v.logo_url as string) || ""} onChange={(x) => update({ logo_url: x })} placeholder="https://..." />
        <div />
        <Field label="اسم العلامة (عربي)" value={(v.logo_text_ar as string) || ""} onChange={(x) => update({ logo_text_ar: x })} />
        <Field label="اسم العلامة (English)" value={(v.logo_text_en as string) || ""} onChange={(x) => update({ logo_text_en: x })} />
        <TextField label="السطر التعريفي (عربي)" value={(v.tagline_ar as string) || ""} onChange={(x) => update({ tagline_ar: x })} />
        <TextField label="السطر التعريفي (English)" value={(v.tagline_en as string) || ""} onChange={(x) => update({ tagline_en: x })} />
      </div>
      <Separator />
      <h3 className="font-semibold text-sm">روابط السوشيال ميديا</h3>
      <div className="grid md:grid-cols-2 gap-3">
        {["twitter", "instagram", "linkedin", "youtube", "tiktok", "snapchat"].map((k) => (
          <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={social[k] || ""} onChange={(x) => update({ social: { ...social, [k]: x } })} placeholder="https://..." />
        ))}
      </div>
      <SaveBar onSave={onSave} saving={saving} />
    </Card>
  );
}

/* ---------- shared inputs ---------- */
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      {label && <Label className="text-xs font-medium">{label}</Label>}
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5 md:col-span-1">
      <Label className="text-xs font-medium">{label}</Label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} />
    </div>
  );
}
function SaveBar({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  return (
    <div className="pt-2 flex justify-end">
      <Button onClick={onSave} disabled={saving}>
        {saving ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
        حفظ التغييرات
      </Button>
    </div>
  );
}