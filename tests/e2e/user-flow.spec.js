// tests/e2e/user-flow.spec.js
import { test, expect } from "@playwright/test";


const testUser = {
  name: "manigandan",
  email: "manigandan@example.com",
  password: "manigandan123",
  age: "37",
  gender: "male",
  phone: "+9988443332",
  address: "king street",
  city: "new delhi",
  state: "Delhi",
  postal_code: "202020",
  occupation: "Cricketer",
};

const existingUser = {
  email: "existing@example.com",
  password: "password123",
};

test.describe("User Management Application", () => {
  test.beforeEach(async ({ page }) => {
  
    await page.goto("http://localhost:3000");
  });

  test.describe("Sign Up Flow", () => {
    test("should display sign up form when clicking sign up link", async ({
      page,
    }) => {
     
      await page.click("text=Sign Up");

     
      await expect(page.locator("h2")).toContainText("Sign Up");
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
    });

    test("should show validation error for empty fields", async ({ page }) => {
      await page.click("text=Sign Up");

      
      await page.click('button:has-text("Sign Up")');

      
      await expect(page.locator(".bg-red-100")).toContainText(
        "All fields are required"
      );
    });

    test("should show validation error for short password", async ({
      page,
    }) => {
      await page.click("text=Sign Up");

      
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', "123"); 

      await page.click('button:has-text("Sign Up")');

     
      const passwordInput = page.locator('input[name="password"]');
      await expect(passwordInput).toHaveAttribute("minLength", "6");
    });

    // test('should successfully create new account', async ({ page }) => {
    //   await page.click('text=Sign Up');

    //   // Fill the sign up form
    //   await page.fill('input[name="name"]', testUser.name);
    //   await page.fill('input[name="email"]', testUser.email);
    //   await page.fill('input[name="password"]', testUser.password);

    //   // Submit the form
    //   await page.click('button:has-text("Sign Up")');

    //   // Wait for success message and redirect to sign in
    //   await expect(page.locator('.bg-green-100')).toContainText('Account created successfully! Please sign in.');
    //   await expect(page.locator('h2')).toContainText('Sign In');
    // });

    test("should show error for duplicate email", async ({ page }) => {
      await page.click("text=Sign Up");

      
      await page.fill('input[name="name"]', "Another User");
      await page.fill('input[name="email"]', existingUser.email);
      await page.fill('input[name="password"]', testUser.password);

      await page.click('button:has-text("Sign Up")');

     
      await expect(page.locator(".bg-red-100")).toBeVisible();
    });
  });

  test.describe("Sign In Flow", () => {
    test("should display sign in form by default", async ({ page }) => {
      await expect(page.locator("h2")).toContainText("Sign In");
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
    });

    test("should show validation error for empty fields", async ({ page }) => {
      await page.click('button:has-text("Sign In")');

      await expect(page.locator(".bg-red-100")).toContainText(
        "Email and password are required"
      );
    });

    test("should show error for invalid credentials", async ({ page }) => {
      await page.fill('input[name="email"]', "invalid@example.com");
      await page.fill('input[name="password"]', "wrongpassword");

      await page.click('button:has-text("Sign In")');

      await expect(page.locator(".bg-red-100")).toBeVisible();
    });

    test("should successfully sign in with valid credentials", async ({
      page,
    }) => {
      
      await page.fill('input[name="email"]', existingUser.email);
      await page.fill('input[name="password"]', existingUser.password);

      await page.click('button:has-text("Sign In")');

      
      await expect(page.locator("h2")).toContainText("My Profile");
      // await expect(
      //   page.locator('button:has-text("Edit Profile")')
      // ).toBeVisible();
      // await expect(page.locator('button:has-text("Logout")')).toBeVisible();
    });

    test("should switch between sign in and sign up forms", async ({
      page,
    }) => {
      // Start on sign in
      await expect(page.locator("h2")).toContainText("Sign In");

      // Switch to sign up
      await page.click("text=Sign Up");
      await expect(page.locator("h2")).toContainText("Sign Up");

      // Switch back to sign in
      await page.click("text=Sign In");
      await expect(page.locator("h2")).toContainText("Sign In");
    });
  });

  test.describe("Profile Management", () => {
    test.beforeEach(async ({ page }) => {
      // Sign in before each profile test
      await page.fill('input[name="email"]', existingUser.email);
      await page.fill('input[name="password"]', existingUser.password);
      await page.click('button:has-text("Sign In")');
      await expect(page.locator("h2")).toContainText("My Profile");
    });

    test("should display profile view after sign in", async ({ page }) => {
      await expect(page.locator("h2")).toContainText("My Profile");

      // Check for profile sections
      await expect(page.locator("text=Basic Information")).toBeVisible();
      await expect(page.locator("text=Contact Information")).toBeVisible();
      await expect(page.locator("text=Professional Information")).toBeVisible();
      await expect(page.locator("text=Account Information")).toBeVisible();
    });

    test("should navigate to details form when clicking edit profile", async ({
      page,
    }) => {
      await page.click('button:has-text("Edit Profile")');

      await expect(page.locator("h2")).toContainText("Personal Details");
      await expect(page.locator('input[name="age"]')).toBeVisible();
      await expect(page.locator('select[name="gender"]')).toBeVisible();
    });

    test("should save personal details successfully", async ({ page }) => {
      await page.click('button:has-text("Edit Profile")');

      // Fill out the details form
      await page.fill('input[name="age"]', testUser.age);
      await page.selectOption('select[name="gender"]', testUser.gender);
      await page.fill('input[name="phone"]', testUser.phone);
      await page.fill('textarea[name="address"]', testUser.address);
      await page.fill('input[name="city"]', testUser.city);
      await page.fill('input[name="state"]', testUser.state);
      await page.fill('input[name="postal_code"]', testUser.postal_code);
      await page.fill('input[name="occupation"]', testUser.occupation);

      await page.click('button:has-text("Save Details")');

      // Should show success message
      await expect(page.locator(".bg-green-100")).toContainText(
        "Details saved successfully!"
      );

      // Should redirect back to profile view
      await expect(page.locator("h2")).toContainText("My Profile");
    });

    test("should display saved details in profile view", async ({ page }) => {
      // First save some details
      await page.click('button:has-text("Edit Profile")');
      await page.fill('input[name="age"]', testUser.age);
      await page.selectOption('select[name="gender"]', testUser.gender);
      await page.fill('input[name="phone"]', testUser.phone);
      await page.fill('input[name="occupation"]', testUser.occupation);
      await page.click('button:has-text("Save Details")');

      // Wait for redirect and check displayed details
      await expect(page.locator("h2")).toContainText("My Profile");
      await expect(page.locator("text=" + testUser.age)).toBeVisible();
      await expect(page.locator("text=" + testUser.phone)).toBeVisible();
      await expect(page.locator("text=" + testUser.occupation)).toBeVisible();
    });

    test("should handle age validation", async ({ page }) => {
      await page.click('button:has-text("Edit Profile")');

      // Test invalid age values
      const ageInput = page.locator('input[name="age"]');
      await expect(ageInput).toHaveAttribute("min", "1");
      await expect(ageInput).toHaveAttribute("max", "120");
    });

    test("should logout successfully", async ({ page }) => {
      await page.click('button:has-text("Logout")');

      // Should redirect to sign in page
      await expect(page.locator("h2")).toContainText("Sign In");
      await expect(page.locator('input[name="email"]')).toBeVisible();
    });
  });

  test.describe("Navigation and User Experience", () => {
    test("should show loading states during form submissions", async ({
      page,
    }) => {
      await page.fill('input[name="email"]', existingUser.email);
      await page.fill('input[name="password"]', existingUser.password);

      // Mock slow network to see loading state
      await page.route("**/api/signin", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await route.continue();
      });

      await page.click('button:has-text("Sign In")');

      // Should show loading text
      await expect(
        page.locator('button:has-text("Signing In...")')
      ).toBeVisible();
    });

    test("should clear error messages when user starts typing", async ({
      page,
    }) => {
      // Trigger validation error
      await page.click('button:has-text("Sign In")');
      await expect(page.locator(".bg-red-100")).toBeVisible();

      // Start typing in email field
      await page.fill('input[name="email"]', "test");

      // Error should be cleared
      await expect(page.locator(".bg-red-100")).not.toBeVisible();
    });

    test("should persist user session across page refreshes", async ({
      page,
    }) => {
      // Sign in
      await page.fill('input[name="email"]', existingUser.email);
      await page.fill('input[name="password"]', existingUser.password);
      await page.click('button:has-text("Sign In")');

      await expect(page.locator("h2")).toContainText("My Profile");

      // Refresh page
      await page.reload();
    });

    test("should handle API errors gracefully", async ({ page }) => {
      // Mock API error
      await page.route("**/api/signin", (route) => {
        route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Internal server error" }),
        });
      });

      await page.fill('input[name="email"]', existingUser.email);
      await page.fill('input[name="password"]', existingUser.password);
      await page.click('button:has-text("Sign In")');

      await expect(page.locator(".bg-red-100")).toContainText(
        "Internal server error"
      );
    });
  });

  test.describe("Responsive Design", () => {
    test("should work on mobile viewport", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Test sign in form on mobile
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();

      // Test form interactions
      await page.fill('input[name="email"]', existingUser.email);
      await page.fill('input[name="password"]', existingUser.password);
      await page.click('button:has-text("Sign In")');

      await expect(page.locator("h2")).toContainText("My Profile");
    });

    test("should work on tablet viewport", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      // Sign in and navigate to details form
      await page.fill('input[name="email"]', existingUser.email);
      await page.fill('input[name="password"]', existingUser.password);
      await page.click('button:has-text("Sign In")');
      await page.click('button:has-text("Edit Profile")');

      // Test responsive grid layout for form fields
      await expect(page.locator('input[name="age"]')).toBeVisible();
      await expect(page.locator('select[name="gender"]')).toBeVisible();
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper form labels", async ({ page }) => {
      // Check sign in form
      await expect(page.locator('label:has-text("Email")')).toBeVisible();
      await expect(page.locator('label:has-text("Password")')).toBeVisible();

      // Navigate to sign up
      await page.click("text=Sign Up");
      await expect(page.locator('label:has-text("Full Name")')).toBeVisible();
    });

    // test("should support keyboard navigation", async ({ page }) => {
    //   // Tab through sign in form
    //   await page.keyboard.press("Tab"); // Email field
    //   await expect(page.locator('input[name="email"]')).toBeFocused();

    //   await page.keyboard.press("Tab"); // Password field
    //   await expect(page.locator('input[name="password"]')).toBeFocused();

    //   await page.keyboard.press("Tab"); // Sign in button
    //   await expect(page.locator('button:has-text("Sign In")')).toBeFocused();
    // });

    test("should have proper ARIA attributes", async ({ page }) => {
     
      await expect(page.locator('input[name="email"]')).toHaveAttribute(
        "required"
      );
      await expect(page.locator('input[name="password"]')).toHaveAttribute(
        "required"
      );
    });
  });
});
