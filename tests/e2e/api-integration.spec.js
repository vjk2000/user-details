import { test, expect } from '@playwright/test';
import { ApiMocks } from '../utils/api-mocks.js';
import { testUsers } from '../fixtures/test-data.js';

test.describe('API Integration Tests', () => {
  let apiMocks;

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    apiMocks = new ApiMocks(page);
  });

  test('handles successful API responses', async ({ page }) => {
    await apiMocks.mockSignInSuccess();
    
    await page.fill('input[name="email"]', testUsers.existingUser.email);
    await page.fill('input[name="password"]', testUsers.existingUser.password);
    await page.click('button:has-text("Sign In")');
    
    await expect(page.locator('h2')).toContainText('My Profile');
  });

  test('handles API errors gracefully', async ({ page }) => {
    await apiMocks.mockSignInError('Invalid credentials');
    
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button:has-text("Sign In")');
    
    await expect(page.locator('.bg-red-100')).toContainText('Invalid credentials');
  });

  test('handles server errors', async ({ page }) => {
    await apiMocks.mockServerError();
    
    await page.fill('input[name="email"]', testUsers.existingUser.email);
    await page.fill('input[name="password"]', testUsers.existingUser.password);
    await page.click('button:has-text("Sign In")');
    
    await expect(page.locator('.bg-red-100')).toContainText('Internal server error');
  });

  test('shows loading states during API calls', async ({ page }) => {
    await apiMocks.mockSlowResponse(1000, '**/api/signin');
    
    await page.fill('input[name="email"]', testUsers.existingUser.email);
    await page.fill('input[name="password"]', testUsers.existingUser.password);
    await page.click('button:has-text("Sign In")');
    await expect(page.locator('button:has-text("Signing In...")')).toBeVisible();
  });

  test('handles network timeouts', async ({ page }) => {
    await apiMocks.mockSlowResponse(10000, '**/api/signin');
    
    await page.fill('input[name="email"]', testUsers.existingUser.email);
    await page.fill('input[name="password"]', testUsers.existingUser.password);
    await page.click('button:has-text("Sign In")');
    await expect(page.locator('button:has-text("Signing In...")')).toBeVisible();
  });
});