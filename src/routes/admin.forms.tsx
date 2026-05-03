import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Inbox, Search, Filter, Mail, Phone, Building2, Calendar,
  CheckCircle2, Circle, Archive, Trash2, ExternalLink, Bell, RefreshCw, Download, Languages,
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

type Lang = "ar" | "en";

const SERVICE_LABELS: Record<string, { ar: string; en: string }> = {
  seo: { ar: "السيو", en: "SEO" },
  ads: { ar: "الإعلانات", en: "Ads" },
  social: { ar: "السوشيال ميديا", en: "Social Media" },
  content: { ar: "المحتوى", en: "Content" },
  design: { ar: "التصميم", en: "Design" },
  web: { ar: "تطوير المواقع", en: "Web Development" },
  branding: { ar: "الهوية البصرية", en: "Branding" },
  ecommerce: { ar: "المتاجر الإلكترونية", en: "E-commerce" },
};

const T = {
  title: { ar: "صندوق الرسائل (Leads)", en: "Leads Inbox" },
  newBadge: { ar: "جديد", en: "new" },
  realtime: { ar: "إشعارات فورية للرسائل الجديدة عبر Realtime", en: "Real-time notifications for new leads" },
  refresh: { ar: "تحديث", en: "Refresh" },
  exportCsv: { ar: "تصدير CSV", en: "Export CSV" },
  total: { ar: "الإجمالي", en: "Total" },
  unread: { ar: "غير مقروءة", en: "Unread" },
  today: { ar: "اليوم", en: "Today" },
  week: { ar: "هذا الأسبوع", en: "This Week" },
  searchPlaceholder: { ar: "ابحث بالاسم، البريد، الهاتف، الرسالة...", en: "Search by name, email, phone, message..." },
  service: { ar: "الخدمة", en: "Service" },
  allServices: { ar: "كل الخدمات", en: "All Services" },
  budget: { ar: "الميزانية", en: "Budget" },
  allBudgets: { ar: "كل الميزانيات", en: "All Budgets" },
  status: { ar: "الحالة", en: "Status" },
  all: { ar: "الكل", en: "All" },
  active: { ar: "نشطة", en: "Active" },
  archived: { ar: "مؤرشفة", en: "Archived" },
  loading: { ar: "جاري التحميل...", en: "Loading..." },
  empty: { ar: "لا توجد رسائل مطابقة", en: "No matching leads" },
  archivedTag: { ar: "مؤرشف", en: "Archived" },
  email: { ar: "البريد", en: "Email" },
  phone: { ar: "الهاتف", en: "Phone" },
  company: { ar: "الشركة", en: "Company" },
  requestedServices: { ar: "الخدمات المطلوبة", en: "Requested Services" },
  fullData: { ar: "كامل البيانات", en: "Full Payload" },
  markUnread: { ar: "وضع كغير مقروءة", en: "Mark as unread" },
  markRead: { ar: "وضع كمقروءة", en: "Mark as read" },
  unarchive: { ar: "إلغاء الأرشفة", en: "Unarchive" },
  archive: { ar: "أرشفة", en: "Archive" },
  delete: { ar: "حذف", en: "Delete" },
  confirmDelete: { ar: "حذف نهائي للرسالة؟", en: "Permanently delete this lead?" },
  deleted: { ar: "تم الحذف", en: "Deleted" },
  deleteFailed: { ar: "فشل الحذف", en: "Delete failed" },
  loadFailed: { ar: "فشل تحميل الرسائل: ", en: "Failed to load: " },
  archivedToast: { ar: "تمت الأرشفة", en: "Archived" },
  restoredToast: { ar: "تمت الاستعادة", en: "Restored" },
  newLeadFrom: { ar: "📥 رسالة جديدة من ", en: "📥 New lead from " },
  view: { ar: "عرض", en: "View" },
  exported: { ar: "تم تصدير CSV", en: "CSV exported" },
  switchLang: { ar: "EN", en: "AR" },
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

function getMessage(p: Record<string, unknown>): string {
  return String(p.message ?? p.notes ?? p.details ?? "");
}

function csvEscape(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function exportCsv(rows: Submission[], lang: Lang) {
  const headers = lang === "ar"
    ? ["التاريخ", "النموذج", "اللغة", "الصفحة", "الاسم", "البريد", "الهاتف", "الشركة", "الخدمات", "الميزانية", "الرسالة", "مقروءة", "مؤرشفة"]
    : ["Date", "Form", "Locale", "Source Page", "Name", "Email", "Phone", "Company", "Services", "Budget", "Message", "Read", "Archived"];
  const lines = [headers.join(",")];
  for (const r of rows) {
    const services = getServices(r.payload).map((s) => SERVICE_LABELS[s]?.[lang] ?? s).join(" | ");
    lines.push([
      new Date(r.created_at).toISOString(),
      r.form_name,
      r.locale ?? "",
      r.source_page ?? "",
      getName(r.payload),
      getEmail(r.payload),
      getPhone(r.payload),
      getCompany(r.payload),
      services,
      getBudgetRange(r.payload) ?? "",
      getMessage(r.payload),
      r.is_read ? "1" : "0",
      r.is_archived ? "1" : "0",
    ].map(csvEscape).join(","));
  }
  const csv = "\uFEFF" + lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function AdminLeadsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [budgetFilter, setBudgetFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [active, setActive] = useState<Submission | null>(null);
  const [lang, setLang] = useState<Lang>("ar");
  const t = (k: keyof typeof T) => T[k][lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("form_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast.error(t("loadFailed") + error.message);
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
          toast.success(`${t("newLeadFrom")}${name}`, {
            description: row.source_page ?? row.form_name,
            action: { label: t("view"), onClick: () => setActive(row) },
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
    toast.success(it.is_archived ? t("restoredToast") : t("archivedToast"));
  };
  const remove = async (it: Submission) => {
    if (!confirm(t("confirmDelete"))) return;
    setItems((p) => p.filter((x) => x.id !== it.id));
    setActive(null);
    const { error } = await supabase.from("form_submissions").delete().eq("id", it.id);
    if (error) { toast.error(t("deleteFailed")); load(); } else toast.success(t("deleted"));
  };

  return (
    <div className="space-y-6" dir={dir}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Inbox className="w-6 h-6 text-primary" />
            {t("title")}
            {stats.unread > 0 && (
              <Badge className="bg-primary text-primary-foreground animate-pulse">
                {stats.unread} {t("newBadge")}
              </Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            <Bell className="inline w-3.5 h-3.5 mx-1" />
            {t("realtime")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>
            <Languages className="w-4 h-4 mx-1" />
            {t("switchLang")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => { exportCsv(filtered, lang); toast.success(t("exported")); }} disabled={filtered.length === 0}>
            <Download className="w-4 h-4 mx-1" />
            {t("exportCsv")}
          </Button>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mx-1 ${loading ? "animate-spin" : ""}`} />
            {t("refresh")}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label={t("total")} value={stats.total} color="bg-primary/10 text-primary" />
        <StatCard label={t("unread")} value={stats.unread} color="bg-amber-500/10 text-amber-600" />
        <StatCard label={t("today")} value={stats.today} color="bg-emerald-500/10 text-emerald-600" />
        <StatCard label={t("week")} value={stats.week} color="bg-blue-500/10 text-blue-600" />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className={lang === "ar" ? "pr-10" : "pl-10"}
            />
          </div>
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mx-1" />
              <SelectValue placeholder={t("service")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allServices")}</SelectItem>
              {Object.entries(SERVICE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v[lang]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={budgetFilter} onValueChange={setBudgetFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder={t("budget")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allBudgets")}</SelectItem>
              {budgetOptions.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder={t("status")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="unread">{t("unread")}</SelectItem>
              <SelectItem value="active">{t("active")}</SelectItem>
              <SelectItem value="archived">{t("archived")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* List */}
      <Card className="divide-y">
        {loading && <div className="p-8 text-center text-muted-foreground">{t("loading")}</div>}
        {!loading && filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <Inbox className="w-12 h-12 mx-auto mb-3 opacity-40" />
            {t("empty")}
          </div>
        )}
        {filtered.map((it) => {
          const services = getServices(it.payload);
          const budget = getBudgetRange(it.payload);
          return (
            <button
              key={it.id}
              onClick={() => { setActive(it); if (!it.is_read) markRead(it, true); }}
              className={`w-full ${lang === "ar" ? "text-right" : "text-left"} p-4 hover:bg-accent transition flex items-start gap-3 ${
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
                  {it.is_archived && <Badge variant="secondary" className="text-[10px]">{t("archivedTag")}</Badge>}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {services.map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">
                      {SERVICE_LABELS[s]?.[lang] ?? s}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(it.created_at).toLocaleString(lang === "ar" ? "ar-SA" : "en-US", { dateStyle: "short", timeStyle: "short" })}
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
        <SheetContent side={lang === "ar" ? "left" : "right"} className="w-full sm:max-w-lg overflow-y-auto" dir={dir}>
          {active && (
            <>
              <SheetHeader>
                <SheetTitle>{getName(active.payload)}</SheetTitle>
                <SheetDescription>
                  {new Date(active.created_at).toLocaleString(lang === "ar" ? "ar-SA" : "en-US")}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <Field icon={Mail} label={t("email")} value={getEmail(active.payload)} link={`mailto:${getEmail(active.payload)}`} />
                <Field icon={Phone} label={t("phone")} value={getPhone(active.payload)} link={`tel:${getPhone(active.payload)}`} />
                <Field icon={Building2} label={t("company")} value={getCompany(active.payload)} />
                {getServices(active.payload).length > 0 && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1.5">{t("requestedServices")}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {getServices(active.payload).map((s) => (
                        <Badge key={s} className="bg-primary/10 text-primary border-primary/20">
                          {SERVICE_LABELS[s]?.[lang] ?? s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {getBudgetRange(active.payload) && (
                  <Field icon={Calendar} label={t("budget")} value={getBudgetRange(active.payload)!} />
                )}
                <div>
                  <div className="text-xs text-muted-foreground mb-1.5">{t("fullData")}</div>
                  <pre className="bg-muted p-3 rounded-lg text-xs overflow-auto max-h-72 text-left" dir="ltr">
                    {JSON.stringify(active.payload, null, 2)}
                  </pre>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button size="sm" variant="outline" onClick={() => markRead(active, !active.is_read)}>
                    {active.is_read ? t("markUnread") : t("markRead")}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => archive(active)}>
                    <Archive className="w-3.5 h-3.5 mx-1" />
                    {active.is_archived ? t("unarchive") : t("archive")}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(active)}>
                    <Trash2 className="w-3.5 h-3.5 mx-1" />
                    {t("delete")}
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
