# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core.spec.ts >> Core E2E >> Home page loads
- Location: tests\core.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('text=KITOBXON').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=KITOBXON').first()
    13 × locator resolved to <a href="/" class="text-2xl font-black tracking-tighter text-[#1C4E41]">KITOBXON</a>
       - unexpected value "hidden"

```

```yaml
- navigation:
  - link "Asosiy":
    - /url: /
  - link "Kashf etish":
    - /url: /search
  - link "Hamjamiyat":
    - /url: /community
  - link "Kirish":
    - /url: /login
- main:
  - text: Xush kelibsiz
  - heading "Kitobni o'qima. Undan fikr yarat." [level=1]
  - paragraph: Kitobxon - qiziqarli adabiyotlar va chuqur mulohazalar uchun mo'ljallangan ijtimoiy platforma.
  - link "Katalog":
    - /url: /search
    - img
    - text: Katalog
  - heading "Ommabop kitoblar" [level=2]
  - link "Barchasi":
    - /url: /search
  - link "O'tkan kunlar O'tkan kunlar 400 sahifa":
    - /url: /books/book_1
    - text: O'tkan kunlar
    - heading "O'tkan kunlar" [level=3]
    - paragraph: 400 sahifa
  - link "Atom odatlar Atom odatlar 320 sahifa":
    - /url: /books/book_2
    - text: Atom odatlar
    - heading "Atom odatlar" [level=3]
    - paragraph: 320 sahifa
  - heading "So'nggi fikrlar" [level=2]
  - link "Hamjamiyat":
    - /url: /community
  - paragraph: Hozircha fikrlar yo'q.
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Core E2E', () => {
  4  |   test('Home page loads', async ({ page }) => {
  5  |     await page.goto('/');
> 6  |     await expect(page.locator('text=KITOBXON').filter({ state: 'visible' }).first()).toBeVisible();
     |                                                                                      ^ Error: expect(locator).toBeVisible() failed
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
  27 |     await page.locator('text=Profil').filter({ state: 'visible' }).first().click();
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