import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const POST_ID = process.env.BLOG_POST_ID ?? "";

test.describe("Publish Guard — editor UI enforcement", () => {
  test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD || !POST_ID, "set ADMIN_EMAIL, ADMIN_PASSWORD, BLOG_POST_ID env vars");

  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel(/email|البريد/i).fill(ADMIN_EMAIL);
    await page.getByLabel(/password|كلمة/i).fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /sign in|دخول|login/i }).click();
    await page.waitForURL(/\/admin(\/|$)/, { timeout: 15_000 });
    await page.goto(`/admin/blog/${POST_ID}`);
    await expect(page.getByText(/حارس جودة النشر/)).toBeVisible({ timeout: 15_000 });
  });

  test("blocks publish when required schema fields are missing", async ({ page }) => {
    const cover = page.getByLabel(/cover|غلاف/i).first();
    if (await cover.isVisible().catch(() => false)) await cover.fill("");
    await expect(page.getByText(/النشر متعذّر/)).toBeVisible();

    page.once("dialog", (d) => d.dismiss());
    const publishBtn = page.getByRole("button", { name: /نشر|publish/i }).first();
    await publishBtn.click().catch(() => {});
    await expect(page.getByText(/النشر متعذّر|لا يمكن النشر/i)).toBeVisible();
  });

  test("YMYL content requires author bio + sources", async ({ page }) => {
    const titleAr = page.getByLabel(/title.*ar|عنوان.*عربي/i).first();
    if (await titleAr.isVisible().catch(() => false)) {
      await titleAr.fill("نصائح طبية حول علاج مرض السكري");
    }
    const bio = page.getByLabel(/bio|نبذة/i).first();
    if (await bio.isVisible().catch(() => false)) await bio.fill("");
    await expect(page.getByText(/YMYL|نبذة الكاتب|مرجع موثوق/)).toBeVisible({ timeout: 10_000 });
  });

  test("verdict flips to ready once required fields are filled", async ({ page }) => {
    const cover = page.getByLabel(/cover|غلاف/i).first();
    if (await cover.isVisible().catch(() => false)) {
      await cover.fill("https://example.com/cover.jpg");
    }
    await page.waitForTimeout(500);
    await expect(page.getByText(/جاهز للنشر|يمكن النشر/)).toBeVisible({ timeout: 10_000 });
  });
});