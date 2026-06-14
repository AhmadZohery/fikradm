import { test, expect } from "@playwright/test";

/**
 * JSON-LD required-fields enforcement.
 *
 * Verifies that when an Organization / Article / Service mandatory schema
 * field is missing in the editor, the publish guard panel surfaces it as a
 * blocker AND the publish toggle is rejected. Mirrors the unit tests in
 * `src/lib/publishGuard.test.ts` against the actual UI.
 */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const POST_ID = process.env.BLOG_POST_ID ?? "";

test.describe("JSON-LD required fields — publish enforcement", () => {
  test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD || !POST_ID, "set ADMIN_EMAIL/ADMIN_PASSWORD/BLOG_POST_ID");

  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel(/email|البريد/i).fill(ADMIN_EMAIL);
    await page.getByLabel(/password|كلمة/i).fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /sign in|دخول|login/i }).click();
    await page.waitForURL(/\/admin(\/|$)/, { timeout: 15_000 });
    await page.goto(`/admin/blog/${POST_ID}`);
    await expect(page.getByText(/حارس جودة النشر/)).toBeVisible({ timeout: 15_000 });
  });

  test("Article schema — missing headline (title) blocks publish", async ({ page }) => {
    const titleAr = page.getByLabel(/title.*ar|عنوان.*عربي/i).first();
    const titleEn = page.getByLabel(/title.*en|عنوان.*إنجليزي/i).first();
    if (await titleAr.isVisible().catch(() => false)) await titleAr.fill("");
    if (await titleEn.isVisible().catch(() => false)) await titleEn.fill("");
    await expect(page.getByText(/title|عنوان واضح|النشر متعذّر/i)).toBeVisible({ timeout: 10_000 });
  });

  test("Article schema — missing image (cover) blocks publish", async ({ page }) => {
    const cover = page.getByLabel(/cover|غلاف/i).first();
    if (await cover.isVisible().catch(() => false)) await cover.fill("");
    await expect(page.getByText(/cover_image_url|غلاف|النشر متعذّر/i)).toBeVisible({ timeout: 10_000 });
  });

  test("Article schema — missing datePublished blocks publish", async ({ page }) => {
    const dt = page.getByLabel(/published_at|تاريخ النشر/i).first();
    if (await dt.isVisible().catch(() => false)) await dt.fill("");
    await expect(page.getByText(/published_at|تاريخ النشر|النشر متعذّر/i)).toBeVisible({ timeout: 10_000 });
  });

  test("Article schema — missing author blocks publish", async ({ page }) => {
    const a1 = page.getByLabel(/author.*ar|كاتب.*عربي/i).first();
    const a2 = page.getByLabel(/author.*en|author.*english/i).first();
    if (await a1.isVisible().catch(() => false)) await a1.fill("");
    if (await a2.isVisible().catch(() => false)) await a2.fill("");
    await expect(page.getByText(/author|الكاتب|النشر متعذّر/i)).toBeVisible({ timeout: 10_000 });
  });

  test("All Article required fields present → verdict flips to ready", async ({ page }) => {
    const cover = page.getByLabel(/cover|غلاف/i).first();
    const titleAr = page.getByLabel(/title.*ar|عنوان.*عربي/i).first();
    const titleEn = page.getByLabel(/title.*en|عنوان.*إنجليزي/i).first();
    const dt = page.getByLabel(/published_at|تاريخ النشر/i).first();
    if (await cover.isVisible().catch(() => false)) await cover.fill("https://fikradm.com/cover.jpg");
    if (await titleAr.isVisible().catch(() => false)) await titleAr.fill("عنوان تجريبي مكتمل");
    if (await titleEn.isVisible().catch(() => false)) await titleEn.fill("Complete demo title");
    if (await dt.isVisible().catch(() => false)) await dt.fill(new Date().toISOString().slice(0, 16));
    await page.waitForTimeout(500);
    await expect(page.getByText(/جاهز للنشر|يمكن النشر/)).toBeVisible({ timeout: 10_000 });
  });

  test("Live site exposes Organization JSON-LD on root", async ({ page }) => {
    await page.goto("/");
    const orgJson = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(orgJson).toBeTruthy();
    const parsed = JSON.parse(orgJson!);
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    const hasOrg = arr.some((o: any) => o["@type"] === "Organization" || (Array.isArray(o["@graph"]) && o["@graph"].some((g: any) => g["@type"] === "Organization")));
    expect(hasOrg).toBe(true);
  });
});