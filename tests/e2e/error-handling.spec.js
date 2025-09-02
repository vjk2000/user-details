import { test, expect } from "@playwright/test";

test.describe("Error Handling", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("handles network failures gracefully", async ({ page }) => {
    await page.route("**/api/**", (route) => route.abort());

    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button:has-text("Sign In")');
  });

  test("handles malformed API responses", async ({ page }) => {
    await page.route("**/api/signin", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "invalid json response",
      });
    });

    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button:has-text("Sign In")');

    await expect(page.locator(".bg-red-100")).toBeVisible();
  });

  test("handles unexpected HTTP status codes", async ({ page }) => {
    await page.route("**/api/signin", (route) => {
      route.fulfill({
        status: 418, 
        contentType: "application/json",
        body: JSON.stringify({ error: "Unexpected error" }),
      });
    });

    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button:has-text("Sign In")');

    await expect(page.locator(".bg-red-100")).toContainText("Unexpected error");
  });

  test("handles missing error messages in API responses", async ({ page }) => {
    
    await page.route("**/api/signin", (route) => {
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({}), 
      });
    });

    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button:has-text("Sign In")');

    
    await expect(page.locator(".bg-red-100")).toContainText("Request failed");
  });
});
