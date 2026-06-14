# E2E Tests — Publish Guard

Verifies the editor UI actually enforces what `src/lib/publishGuard.ts` computes:
blocks publishing when Readability / YMYL / Schema requirements fail and allows
it when they pass.

## Setup

    bun add -d @playwright/test
    bunx playwright install --with-deps chromium

## Run

    ADMIN_EMAIL=admin@fikra.local \
    ADMIN_PASSWORD='Fikra@Admin29437!' \
    BLOG_POST_ID=<existing draft post id> \
    bunx playwright test

Optional: `BASE_URL=https://fikradm.lovable.app` to run against the deployed site.
Tests skip automatically if `BLOG_POST_ID` is not set.