import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('application loads successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('h2')).toContainText('Sign In');
  });

  test('can navigate between sign in and sign up', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    // Start on sign in
    await expect(page.locator('h2')).toContainText('Sign In');
    
    // Go to sign up
    await page.click('text=Sign Up');
    await expect(page.locator('h2')).toContainText('Sign Up');
    
    // Back to sign in
    await page.click('text=Sign In');
    await expect(page.locator('h2')).toContainText('Sign In');
  });
});