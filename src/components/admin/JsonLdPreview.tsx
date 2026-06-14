import { useMemo, useState } from "react";
import { Check, Copy, Code2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { articleSchema, serviceSchema, faqSchema, breadcrumbSchema, organizationSchema } from "@/lib/schemaGen";

export type JsonLdPreviewInput = {
  kind: "article" | "service" | "page";
  url: string;
  title: string;
  description: string;
  image?: string;
  author?: string;
  authorRole?: string;
  datePublished?: string;
  dateModified?: string;
  lastReviewed?: string;
  keywords?: string[];
  ymyl?: boolean;
  faq?: { q: string; a: string }[];
  breadcrumbs?: { name: string; url: string }[];
};

type Block = { name: string; data: any; required: string[]; recommended: string[] };

function buildBlocks(i: JsonLdPreviewInput): Block[] {
  const blocks: Block[] = [];
  blocks.push({
    name: "Organization",
    data: organizationSchema(),
    required: ["name", "url", "logo"],
    recommended: ["sameAs"],
  });

  if (i.kind === "article") {
    blocks.push({
      name: i.ymyl ? "MedicalWebPage" : "Article",
      data: articleSchema(i),
      required: ["headline", "description", "author", "datePublished", "image"],
      recommended: ["dateModified", "lastReviewed", "keywords"],
    });
  } else if (i.kind === "service") {
    blocks.push({
      name: "Service",
      data: serviceSchema({ name: i.title, description: i.description, url: i.url, image: i.image }),
      required: ["name", "description", "url", "provider"],
      recommended: ["image", "areaServed"],
    });
  }

  if (i.faq && i.faq.length > 0) {
    blocks.push({
      name: "FAQPage",
      data: faqSchema(i.faq),
      required: ["mainEntity"],
      recommended: [],
    });
  }

  if (i.breadcrumbs && i.breadcrumbs.length > 0) {
    blocks.push({
      name: "BreadcrumbList",
      data: breadcrumbSchema(i.breadcrumbs),
      required: ["itemListElement"],
      recommended: [],
    });
  }

  return blocks;
}

function validateBlock(b: Block): { field: string; level: "error" | "warn"; msg: string }[] {
  const issues: { field: string; level: "error" | "warn"; msg: string }[] = [];
  for (const f of b.required) {
    const v = (b.data as any)[f];
    if (v == null || (Array.isArray(v) && v.length === 0) || v === "") {
      issues.push({ field: f, level: "error", msg: `حقل إلزامي مفقود: ${f}` });
    }
  }
  for (const f of b.recommended) {
    const v = (b.data as any)[f];
    if (v == null || (Array.isArray(v) && v.length === 0) || v === "") {
      issues.push({ field: f, level: "warn", msg: `حقل موصى به مفقود: ${f}` });
    }
  }
  return issues;
}

export function JsonLdPreview({ input }: { input: JsonLdPreviewInput }) {
  const blocks = useMemo(() => buildBlocks(input), [input]);
  const [active, setActive] = useState(blocks[0]?.name ?? "");
  const [copied, setCopied] = useState<string | null>(null);

  const totalErrors = blocks.reduce((a, b) => a + validateBlock(b).filter((x) => x.level === "error").length, 0);

  const copy = async (name: string, data: any) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(name);
      setTimeout(() => setCopied(null), 1500);
    } catch { /* ignore */ }
  };

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">معاينة JSON-LD المباشرة</h3>
        </div>
        <Badge variant={totalErrors === 0 ? "default" : "destructive"}>
          {totalErrors === 0 ? "صالح" : `${totalErrors} خطأ`}
        </Badge>
      </div>

      <Tabs value={active} onValueChange={setActive}>
        <TabsList className="flex flex-wrap h-auto">
          {blocks.map((b) => {
            const errs = validateBlock(b).filter((x) => x.level === "error").length;
            return (
              <TabsTrigger key={b.name} value={b.name} className="gap-1.5">
                {b.name}
                {errs > 0 && <Badge variant="destructive" className="h-4 px-1 text-[10px]">{errs}</Badge>}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {blocks.map((b) => {
          const issues = validateBlock(b);
          return (
            <TabsContent key={b.name} value={b.name} className="space-y-2">
              {issues.length > 0 && (
                <ul className="space-y-1 rounded-md border border-border/60 bg-surface/40 p-2 text-xs">
                  {issues.map((it, i) => (
                    <li key={i} className={`flex items-start gap-1.5 ${it.level === "error" ? "text-destructive" : "text-amber-500"}`}>
                      <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
                      <span>{it.msg}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute end-2 top-2 h-7 gap-1 text-xs"
                  onClick={() => copy(b.name, b.data)}
                >
                  {copied === b.name ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied === b.name ? "نُسخ" : "نسخ"}
                </Button>
                <pre className="max-h-72 overflow-auto rounded-md border border-border/60 bg-muted/30 p-3 text-[11px] leading-relaxed" dir="ltr">
                  {JSON.stringify(b.data, null, 2)}
                </pre>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </Card>
  );
}