# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core.spec.ts >> Core E2E >> User Registration and Flow
- Location: tests\core.spec.ts:10:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Profil').first()
    - locator resolved to <a href="/profile" class="flex items-center gap-2 text-sm font-semibold transition-colors text-gray-500 hover:text-gray-900">…</a>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    51 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - link "Asosiy" [ref=e4] [cursor=pointer]:
        - /url: /
      - link "Kashf etish" [ref=e10] [cursor=pointer]:
        - /url: /search
      - link "Hamjamiyat" [ref=e16] [cursor=pointer]:
        - /url: /community
      - link "Profil" [ref=e24] [cursor=pointer]:
        - /url: /profile
  - main [ref=e31]:
    - generic [ref=e34]:
      - generic [ref=e35]: Xush kelibsiz
      - heading "Kitobni o'qima. Undan fikr yarat." [level=1] [ref=e36]: Kitobni o'qima.Undan fikr yarat.
      - paragraph [ref=e37]: Kitobxon - qiziqarli adabiyotlar va chuqur mulohazalar uchun mo'ljallangan ijtimoiy platforma.
      - link "Katalog" [ref=e39] [cursor=pointer]:
        - /url: /search
    - generic [ref=e43]:
      - generic [ref=e44]:
        - generic [ref=e45]:
          - heading "Ommabop kitoblar" [level=2] [ref=e46]
          - link "Barchasi" [ref=e50] [cursor=pointer]:
            - /url: /search
        - generic [ref=e51]:
          - link "O'tkan kunlar O'tkan kunlar 400 sahifa" [ref=e52] [cursor=pointer]:
            - /url: /books/book_1
            - generic [ref=e53]: O'tkan kunlar
            - heading "O'tkan kunlar" [level=3] [ref=e58]
            - paragraph [ref=e59]: 400 sahifa
          - link "Atom odatlar Atom odatlar 320 sahifa" [ref=e60] [cursor=pointer]:
            - /url: /books/book_2
            - generic [ref=e61]: Atom odatlar
            - heading "Atom odatlar" [level=3] [ref=e66]
            - paragraph [ref=e67]: 320 sahifa
      - generic [ref=e68]:
        - generic [ref=e69]:
          - heading "So'nggi fikrlar" [level=2] [ref=e70]
          - link "Hamjamiyat" [ref=e73] [cursor=pointer]:
            - /url: /community
        - paragraph [ref=e75]: Hozircha fikrlar yo'q.
  - generic [ref=e80] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e81]
    - generic [ref=e85]:
      - button "Open issues overlay" [ref=e86]:
        - generic [ref=e87]:
          - generic [ref=e88]: "0"
          - generic [ref=e89]: "1"
        - generic [ref=e90]: Issue
      - button "Collapse issues badge" [ref=e91]
  - alert [ref=e94]: Kitobni o'qima. Undan fikr yarat.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Core E2E', () => {
  4  |   test('Home page loads', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await expect(page.locator('text=KITOBXON').filter({ state: 'visible' }).first()).toBeVisible();
  7  |     await expect(page.locator('text=Kashf etish').filter({ state: 'visible' }).first()).toBeVisible();
  8  |   });
  9  | 
  10 |   test('User Registration and Flow', async ({ page }) => {
  11 |     const username = 'testuser_' + Date.now();
  12 |     
  13 |     await page.goto('/register');
  14 |     await page.fill('input[name="username"]', username);
  15 |     await page.fill('input[name="displayName"]', 'Test User');
  16 |     await page.fill('input[name="password"]', 'password123');
  17 |     await page.click('button[type="submit"]');
  18 |     
  19 |     await expect(page).toHaveURL(/.*\/login/);
  20 |     
  21 |     await page.fill('input[name="username"]', username);
  22 |     await page.fill('input[name="password"]', 'password123');
  23 |     await page.click('button[type="submit"]');
  24 |     
  25 |     await expect(page).toHaveURL('http://localhost:3000/');
  26 |     
> 27 |     await page.locator('text=Profil').filter({ state: 'visible' }).first().click();
     |                                                                            ^ Error: locator.click: Test timeout of 30000ms exceeded.
  28 |     await expect(page).toHaveURL(/.*\/profile/);
  29 |     await expect(page.locator('text=Test User').first()).toBeVisible();
  30 |     
  31 |     await page.goto('/search');
  32 |     await expect(page).toHaveURL(/.*\/search/);
  33 |     await expect(page.locator('input[name="q"]')).toBeVisible();
  34 |   });
  35 | });
  36 | 
```