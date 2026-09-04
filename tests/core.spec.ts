import { test, expect } from '@playwright/test';

test.describe('Core E2E', () => {
  test('Home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=KITOBXON').filter({ state: 'visible' }).first()).toBeVisible();
    await expect(page.locator('text=Kashf etish').filter({ state: 'visible' }).first()).toBeVisible();
  });

  test('User Registration and Flow', async ({ page }) => {
    const username = 'testuser_' + Date.now();
    
    await page.goto('/register');
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/login/);
    
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('http://localhost:3000/');
    
    await page.locator('text=Profil').filter({ state: 'visible' }).first().click();
    await expect(page).toHaveURL(/.*\/profile/);
    await expect(page.locator('text=Test User').first()).toBeVisible();
    
    await page.goto('/search');
    await expect(page).toHaveURL(/.*\/search/);
    await expect(page.locator('input[name="q"]')).toBeVisible();
  });
});
