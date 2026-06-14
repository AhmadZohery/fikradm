import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Shield, Check, X, RefreshCw, Settings2, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/spam-queue")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: SpamQueuePage,
});

type Rule = {
  id: string;
  name: string;
  rule_type: "keyword" | "regex" | "email_domain" | "link_count" | "min_length" | "blocklist_ip";
  pattern: string;
  field: string;
  weight: number;
  is_active: boolean;
};

type Submission = {
  id: string;
  created_at: string;
  form_name: string;
  source_page: string | null;
  spam_score: number;
  spam_status: string;
  spam_reasons: any[];
  attribution_source: string | null;
  attribution_medium: string | null;
  payload: Record<string, any>;
};

function pickText(obj: any, field: string): string {
  if (!obj) return "";
  if (field === "any") {
    return Object.values(obj).filter((v) => typeof v === "string").join(" ");
  }
  const v = obj[field];
  if (typeof v === "string") return v;
  // fallback common keys
  if (field === "message") return obj.goal || obj.message || obj.notes || "";
  if (field === "email") return obj.email || obj.contact_email || "";
  if (field === "name") return obj.name || obj.full_name || "";
  if (field === "phone") return obj.phone || obj.tel || "";
  if (field === "company") return obj.company || obj.brand || "";
  return "";
}

function scoreSubmission(s: Submission, rules: Rule[]): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  for (const r of rules) {
    if (!r.is_active) continue;
    const text = pickText(s.payload, r.field);
    let hit = false;
    try {
      if (r.rule_type === "keyword") {
        const re = new RegExp(r.pattern, "i");
        hit = re.test(text);
      } else if (r.rule_type === "regex") {
        hit = new RegExp(r.pattern, "i").test(text);
      } else if (r.rule_type === "email_domain") {
        const email = pickText(s.payload, "email").toLowerCase();
        const domains = r.pattern.split("|").map((d) => d.trim());
        hit = domains.some((d) => email.endsWith("@" + d) || email.includes(d));
      } else if (r.rule_type === "link_count") {
        const links = (text.match(/https?:\/\//gi) || []).length;
        hit = links >= Number(r.pattern);
      } else if (r.rule_type === "min_length") {
        hit = text.trim().length < Number(r.pattern);
      }
    } catch {}
    if (hit) {
      score += r.weight;
      reasons.push(r.name);
    }
  }
  return { score: Math.min(100, score), reasons };
}

function SpamQueuePage() {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");

  const load = async () => {
    setLoading(true);
    const [{ data: s }, { data: r }] = await Promise.all([
      supabase
        .from("form_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
      supabase.from("spam_rules").select("*").order("weight", { ascending: false }),
    ]);
    setSubs((s as any) || []);
    setRules((r as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const scored = useMemo(() => {
    return subs.map((s) => {
      const { score, reasons } = scoreSubmission(s, rules);
      return { ...s, _score: score, _reasons: reasons };
    });
  }, [subs, rules]);

  const filtered = useMemo(() => {
    if (tab === "pending") return scored.filter((s) => s.spam_status === "pending");
    if (tab === "approved") return scored.filter((s) => s.spam_status === "approved" || s.spam_status === "auto_approved");
    if (tab === "rejected") return scored.filter((s) => s.spam_status === "rejected" || s.spam_status === "auto_rejected");
    return scored;
  }, [scored, tab]);

  const decide = async (id: string, status: "approved" | "rejected", row: any) => {
    const { error } = await supabase
      .from("form_submissions")
      .update({
        spam_status: status,
        spam_score: row._score,
        spam_reasons: row._reasons,
        reviewed_at: new Date().toISOString(),
      } as any)
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(status === "approved" ? "تمت الموافقة" : "تم الرفض");
    load();
  };

  const bulkAutoScore = async () => {
    let approved = 0, rejected = 0;
    for (const s of scored.filter((x) => x.spam_status === "pending")) {
      if (s._score >= 60) {
        await supabase.from("form_submissions").update({ spam_status: "auto_rejected", spam_score: s._score, spam_reasons: s._reasons, reviewed_at: new Date().toISOString() } as any).eq("id", s.id);
        rejected++;
      } else if (s._score <= 10) {
        await supabase.from("form_submissions").update({ spam_status: "auto_approved", spam_score: s._score, spam_reasons: s._reasons, reviewed_at: new Date().toISOString() } as any).eq("id", s.id);
        approved++;
      }
    }
    toast.success(`Auto: ${approved} approved، ${rejected} rejected`);
    load();
  };

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold"><Shield className="h-6 w-6 text-primary" /> طابور مراجعة الـ Leads</h1>
          <p className="text-sm text-muted-foreground">scoring تلقائي + موافقة/رفض قبل الظهور في الـ dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={load}><RefreshCw className="me-1 h-4 w-4" /> تحديث</Button>
          <Button size="sm" onClick={bulkAutoScore}>Auto-decide (≥60 spam، ≤10 ok)</Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="pending">قيد المراجعة ({scored.filter(s=>s.spam_status==='pending').length})</TabsTrigger>
          <TabsTrigger value="approved">معتمد</TabsTrigger>
          <TabsTrigger value="rejected">مرفوض</TabsTrigger>
          <TabsTrigger value="rules">القواعد ({rules.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="space-y-3">
          {tab !== "rules" && (
            <>
              {loading && <p className="text-center text-xs text-muted-foreground">جاري التحميل…</p>}
              {!loading && filtered.length === 0 && (
                <Card className="p-8 text-center text-sm text-muted-foreground">لا توجد عناصر</Card>
              )}
              {filtered.map((s: any) => (
                <Card key={s.id} className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={s._score >= 60 ? "bg-destructive text-destructive-foreground" : s._score >= 25 ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}>
                          score {s._score}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString("ar-SA")}</span>
                        {s.attribution_source && (
                          <Badge variant="outline" className="text-xs">
                            {s.attribution_source} / {s.attribution_medium}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 text-sm">
                        <strong>{pickText(s.payload, "name") || "—"}</strong>
                        {" · "}<span className="text-muted-foreground">{pickText(s.payload, "email")}</span>
                        {pickText(s.payload, "phone") && <> · <span className="text-muted-foreground">{pickText(s.payload, "phone")}</span></>}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{pickText(s.payload, "message") || pickText(s.payload, "any").slice(0, 200)}</p>
                      {s._reasons.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {s._reasons.map((r: string) => <Badge key={r} variant="outline" className="text-[10px]">{r}</Badge>)}
                        </div>
                      )}
                    </div>
                    {s.spam_status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => decide(s.id, "approved", s)}><Check className="me-1 h-4 w-4" /> موافقة</Button>
                        <Button size="sm" variant="destructive" onClick={() => decide(s.id, "rejected", s)}><X className="me-1 h-4 w-4" /> رفض</Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </>
          )}

          {tab === "rules" && <RulesEditor rules={rules} onChange={load} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RulesEditor({ rules, onChange }: { rules: Rule[]; onChange: () => void }) {
  const [draft, setDraft] = useState<Partial<Rule>>({ rule_type: "keyword", field: "message", weight: 20, is_active: true, pattern: "", name: "" });

  const add = async () => {
    if (!draft.name || !draft.pattern) return toast.error("اسم ونمط مطلوبين");
    const { error } = await supabase.from("spam_rules").insert(draft as any);
    if (error) return toast.error(error.message);
    setDraft({ rule_type: "keyword", field: "message", weight: 20, is_active: true, pattern: "", name: "" });
    onChange();
    toast.success("أُضيفت القاعدة");
  };

  const toggle = async (r: Rule) => {
    await supabase.from("spam_rules").update({ is_active: !r.is_active } as any).eq("id", r.id);
    onChange();
  };

  const del = async (id: string) => {
    if (!confirm("حذف القاعدة؟")) return;
    await supabase.from("spam_rules").delete().eq("id", id);
    onChange();
  };

  return (
    <div className="space-y-3">
      <Card className="space-y-3 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold"><Settings2 className="h-4 w-4" /> قاعدة جديدة</div>
        <div className="grid gap-2 sm:grid-cols-6">
          <Input placeholder="الاسم" value={draft.name || ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="sm:col-span-2" />
          <Select value={draft.rule_type} onValueChange={(v) => setDraft({ ...draft, rule_type: v as Rule["rule_type"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="keyword">keyword</SelectItem>
              <SelectItem value="regex">regex</SelectItem>
              <SelectItem value="email_domain">email_domain</SelectItem>
              <SelectItem value="link_count">link_count</SelectItem>
              <SelectItem value="min_length">min_length</SelectItem>
            </SelectContent>
          </Select>
          <Select value={draft.field} onValueChange={(v) => setDraft({ ...draft, field: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">any</SelectItem>
              <SelectItem value="message">message</SelectItem>
              <SelectItem value="email">email</SelectItem>
              <SelectItem value="name">name</SelectItem>
              <SelectItem value="phone">phone</SelectItem>
              <SelectItem value="company">company</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="النمط" value={draft.pattern || ""} onChange={(e) => setDraft({ ...draft, pattern: e.target.value })} />
          <Input type="number" placeholder="الوزن" value={draft.weight ?? 20} onChange={(e) => setDraft({ ...draft, weight: Number(e.target.value) })} />
        </div>
        <Button size="sm" onClick={add}><Plus className="me-1 h-4 w-4" /> إضافة</Button>
      </Card>

      {rules.map((r) => (
        <Card key={r.id} className="flex items-center justify-between gap-3 p-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-sm font-semibold">
              {r.name}
              <Badge variant="outline" className="text-[10px]">{r.rule_type}</Badge>
              <Badge variant="outline" className="text-[10px]">{r.field}</Badge>
              <Badge className="text-[10px]">+{r.weight}</Badge>
            </div>
            <p className="mt-1 truncate font-mono text-xs text-muted-foreground" dir="ltr">{r.pattern}</p>
          </div>
          <Switch checked={r.is_active} onCheckedChange={() => toggle(r)} />
          <Button size="icon" variant="ghost" onClick={() => del(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </Card>
      ))}
    </div>
  );
}