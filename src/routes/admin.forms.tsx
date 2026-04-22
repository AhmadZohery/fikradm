import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Inbox, Search, Filter, Mail, Phone, Building2, Calendar,
  CheckCircle2, Circle, Archive, Trash2, ExternalLink, Bell, RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/admin/forms")({
  component: AdminLeadsPage,
});

type Submission = {
  id: string;
  created_at: string;
  form_name: string;
  locale: string | null;
  source_page: string | null;
  is_read: boolean;
  is_archived: boolean;
  payload: Record<string, unknown>;
};

const SERVICE_LABELS: Record<string, string> = {
  seo: "السيو",
  ads: "الإعلانات",
  social: "السوشيال ميديا",
  content: "المحتوى",
  design: "التصميم",
  web: "تطوير المواقع",
  branding: "الهوية البصرية",
  ecommerce: "المتاجر الإلكترونية",
};

function getServices(p: Record<string, unknown>): string[] {
  const s = p.services ?? p.service;
  if (Array.isArray(s)) return s.map(String);
  if (typeof s === "string") return [s];
  return [];
}

function getBudgetRange(p: Record<string, unknown>): string | null {
  const b = p.budget ?? p.budgetRange ?? p.budget_range;
  return typeof b === "string" ? b : null;
}

function getName(p: Record<string, unknown>): string {
  return String(p.name ?? p.fullName ?? p.full_name ?? "—");
}
function getEmail(p: Record<string, unknown>): string {
  return String(p.email ?? "—");
}
function getPhone(p: Record<string, unknown>): string {
  return String(p.phone ?? p.whatsapp ?? "—");
}
function getCompany(p: Record<string, unknown>): string {
  return String(p.company ?? p.business ?? "—");
}

function AdminLeadsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [budgetFilter, setBudgetFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [active, setActive] = useState<Submission | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("form_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast.error("فشل تحميل الرسائل: " + error.message);
    setItems((data ?? []) as Submission[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel("form_submissions_admin")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "form_submissions" },
        (payload) => {
          const row = payload.new as Submission;
          setItems((prev) => [row, ...prev]);
          const name = getName(row.payload);
          toast.success(`📥 رسالة جديدة من ${name}`, {
            description: row.source_page ?? row.form_name,
            action: { label: "عرض", onClick: () => setActive(row) },
          });
          // Optional: subtle sound
          try {
            const a = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA");
            a.volume = 0.3; a.play().catch(() => {});
          } catch { /* noop */ }
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (statusFilter === "unread" && it.is_read) return false;
      if (statusFilter === "archived" && !it.is_archived) return false;
      if (statusFilter === "active" && it.is_archived) return false;
      if (serviceFilter !== "all") {
        const s = getServices(it.payload);
        if (!s.includes(serviceFilter)) return false;
      }
      if (budgetFilter !== "all") {
        if (getBudgetRange(it.payload) !== budgetFilter) return false;
      }
      if (q.trim()) {
        const blob = JSON.stringify(it.payload).toLowerCase() + " " + (it.source_page ?? "").toLowerCase();
        if (!blob.includes(q.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [items, q, serviceFilter, budgetFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const unread = items.filter((i) => !i.is_read).length;
    const today = items.filter((i) => {
      const d = new Date(i.created_at); const n = new Date();
      return d.toDateString() === n.toDateString();
    }).length;
    const week = items.filter((i) => {
      const d = new Date(i.created_at); return Date.now() - d.getTime() < 7 * 86400000;
    }).length;
    return { total, unread, today, week };
  }, [items]);

  const budgetOptions = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => { const b = getBudgetRange(i.payload); if (b) set.add(b); });
    return Array.from(set);
  }, [items]);

  const markRead = async (it: Submission, read = true) => {
    setItems((p) => p.map((x) => x.id === it.id ? { ...x, is_read: read } : x));
    await supabase.from("form_submissions").update({ is_read: read }).eq("id", it.id);
  };
  const archive = async (it: Submission) => {
    setItems((p) => p.map((x) => x.id === it.id ? { ...x, is_archived: !x.is_archived } : x));
    await supabase.from("form_submissions").update({ is_archived: !it.is_archived }).eq("id", it.id);
    toast.success(it.is_archived ? "تمت الاستعادة" : "تمت الأرشفة");
  };
  const remove = async (it: Submission) => {
    if (!confirm("حذف نهائي للرسالة؟")) return;
    setItems((p) => p.filter((x) => x.id !== it.id));
    setActive(null);
    const { error } = await supabase.from("form_submissions").delete().eq("id", it.id);
    if (error) { toast.error("فشل الحذف"); load(); } else toast.success("تم الحذف");
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Inbox className="w-6 h-6 text-primary" />
            صندوق الرسائل (Leads)
            {stats.unread > 0 && (
              <Badge className="bg-primary text-primary-foreground animate-pulse">
                {stats.unread} جديد
              </Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            <Bell className="inline w-3.5 h-3.5 ms-1" />
            إشعارات فورية للرسائل الجديدة عبر Realtime
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ms-2 ${loading ? "animate-spin" : ""}`} />
          تحديث
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="الإجمالي" value={stats.total} color="bg-primary/10 text-primary" />
        <StatCard label="غير مقروءة" value={stats.unread} color="bg-amber-500/10 text-amber-600" />
        <StatCard label="اليوم" value={stats.today} color="bg-emerald-500/10 text-emerald-600" />
        <StatCard label="هذا الأسبوع" value={stats.week} color="bg-blue-500/10 text-blue-600" />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث بالاسم، البريد، الهاتف، الرسالة..."
              className="pr-10"
            />
          </div>
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 ms-2" />
              <SelectValue placeholder="الخدمة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الخدمات</SelectItem>
              {Object.entries(SERVICE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={budgetFilter} onValueChange={setBudgetFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="الميزانية" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الميزانيات</SelectItem>
              {budgetOptions.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="الحالة" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="unread">غير مقروءة</SelectItem>
              <SelectItem value="active">نشطة</SelectItem>
              <SelectItem value="archived">مؤرشفة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* List */}
      <Card className="divide-y">
        {loading && <div className="p-8 text-center text-muted-foreground">جاري التحميل...</div>}
        {!loading && filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <Inbox className="w-12 h-12 mx-auto mb-3 opacity-40" />
            لا توجد رسائل مطابقة
          </div>
        )}
        {filtered.map((it) => {
          const services = getServices(it.payload);
          const budget = getBudgetRange(it.payload);
          return (
            <button
              key={it.id}
              onClick={() => { setActive(it); if (!it.is_read) markRead(it, true); }}
              className={`w-full text-right p-4 hover:bg-accent transition flex items-start gap-3 ${
                !it.is_read ? "bg-primary/5" : ""
              }`}
            >
              <div className="mt-1 shrink-0">
                {it.is_read ? (
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Circle className="w-4 h-4 text-primary fill-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`font-semibold ${!it.is_read ? "text-foreground" : "text-foreground/80"}`}>
                    {getName(it.payload)}
                  </span>
                  <span className="text-xs text-muted-foreground">{getEmail(it.payload)}</span>
                  {budget && <Badge variant="outline" className="text-[10px]">{budget}</Badge>}
                  {it.is_archived && <Badge variant="secondary" className="text-[10px]">مؤرشف</Badge>}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {services.map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">
                      {SERVICE_LABELS[s] ?? s}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(it.created_at).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                  {it.source_page && (
                    <span className="truncate max-w-xs inline-flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      {it.source_page}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </Card>

      {/* Detail sheet */}
      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto" dir="rtl">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle>{getName(active.payload)}</SheetTitle>
                <SheetDescription>
                  {new Date(active.created_at).toLocaleString("ar-SA")}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <Field icon={Mail} label="البريد" value={getEmail(active.payload)} link={`mailto:${getEmail(active.payload)}`} />
                <Field icon={Phone} label="الهاتف" value={getPhone(active.payload)} link={`tel:${getPhone(active.payload)}`} />
                <Field icon={Building2} label="الشركة" value={getCompany(active.payload)} />
                {getServices(active.payload).length > 0 && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1.5">الخدمات المطلوبة</div>
                    <div className="flex flex-wrap gap-1.5">
                      {getServices(active.payload).map((s) => (
                        <Badge key={s} className="bg-primary/10 text-primary border-primary/20">
                          {SERVICE_LABELS[s] ?? s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {getBudgetRange(active.payload) && (
                  <Field icon={Calendar} label="الميزانية" value={getBudgetRange(active.payload)!} />
                )}
                <div>
                  <div className="text-xs text-muted-foreground mb-1.5">كامل البيانات</div>
                  <pre className="bg-muted p-3 rounded-lg text-xs overflow-auto max-h-72 text-left" dir="ltr">
                    {JSON.stringify(active.payload, null, 2)}
                  </pre>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button size="sm" variant="outline" onClick={() => markRead(active, !active.is_read)}>
                    {active.is_read ? "وضع كغير مقروءة" : "وضع كمقروءة"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => archive(active)}>
                    <Archive className="w-3.5 h-3.5 ms-1.5" />
                    {active.is_archived ? "إلغاء الأرشفة" : "أرشفة"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(active)}>
                    <Trash2 className="w-3.5 h-3.5 ms-1.5" />
                    حذف
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card className="p-4">
      <div className={`inline-flex w-9 h-9 items-center justify-center rounded-lg ${color} mb-2`}>
        <Inbox className="w-4 h-4" />
      </div>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Card>
  );
}

function Field({ icon: Icon, label, value, link }: { icon: typeof Mail; label: string; value: string; link?: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted grid place-items-center shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        {link ? (
          <a href={link} className="text-sm font-medium text-primary hover:underline break-all">{value}</a>
        ) : (
          <div className="text-sm font-medium break-all">{value}</div>
        )}
      </div>
    </div>
  );
}
