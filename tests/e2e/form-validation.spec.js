import { test, expect } from '@playwright/test';
import { SignInPage, SignUpPage, DetailsFormPage } from '../utils/page-objects.js';

test.describe('Form Validation Tests', () => {
  test.describe('Sign Up Form Validation', () => {
    let signUpPage;

    test.beforeEach(async ({ page }) => {
      signUpPage = new SignUpPage(page);
      await page.goto('http://localhost:3000/');
      await page.click('text=Sign Up');
    });

    test('validates required fields', async ({ page }) => {
      await signUpPage.signUpButton.click();
      await expect(signUpPage.errorMessage).toContainText('All fields are required');
    });

    test('validates email format', async ({ page }) => {
      await signUpPage.nameInput.fill('Test User');
      await signUpPage.emailInput.fill('invalid-email');
      await signUpPage.passwordInput.fill('password123');
      const emailInput = signUpPage.emailInput;
      await expect(emailInput).toHaveAttribute('type', 'email');
    });

    test('validates password length', async ({ page }) => {
      await signUpPage.nameInput.fill('Test User');
      await signUpPage.emailInput.fill('test@example.com');
      await signUpPage.passwordInput.fill('123'); // Too short
      
      const passwordInput = signUpPage.passwordInput;
      await expect(passwordInput).toHaveAttribute('minLength', '6');
    });

    test('clears validation errors on input change', async ({ page }) => {
      await signUpPage.signUpButton.click();
      await expect(signUpPage.errorMessage).toBeVisible();
      await signUpPage.nameInput.fill('T');
      await expect(signUpPage.errorMessage).not.toBeVisible();
    });
  });

  test.describe('Sign In Form Validation', () => {
    let signInPage;

    test.beforeEach(async ({ page }) => {
      signInPage = new SignInPage(page);
      await page.goto('http://localhost:3000/');
    });

    test('validates required fields', async ({ page }) => {
      await signInPage.signInButton.click();
      await expect(signInPage.errorMessage).toContainText('Email and password are required');
    });

    test('validates email format', async ({ page }) => {
      const emailInput = signInPage.emailInput;
      await expect(emailInput).toHaveAttribute('type', 'email');
      await expect(emailInput).toHaveAttribute('required');
    });

    test('validates password requirement', async ({ page }) => {
      const passwordInput = signInPage.passwordInput;
      await expect(passwordInput).toHaveAttribute('type', 'password');
      await expect(passwordInput).toHaveAttribute('required');
    });
  });

  // test.describe('Details Form Validation', () => {
  //   let detailsPage;

  //   test.beforeEach(async ({ page }) => {
  //     // Mock sign in and navigate to details
  //     await page.goto('http://localhost:3000/');
  //     await page.fill('input[name="email"]', 'test@example.com');
  //     await page.fill('input[name="password"]', 'password123');
      
  //     // Mock successful sign in
  //     await page.route('http://localhost:3000/', route => {
  //       route.fulfill({
  //         status: 200,
  //         contentType: 'application/json',
  //         body: JSON.stringify({
  //           user: { id: 1, name: 'Test User', email: 'test@example.com' }
  //         })
  //       });
  //     });
      
  //     await page.click('button:has-text("Sign In")');
  //     await page.click('button:has-text("Edit Profile")');
      
  //     detailsPage = new DetailsFormPage(page);
  //   });

  //   test('validates age range', async ({ page }) => {
  //     const ageInput = detailsPage.ageInput;
  //     await expect(ageInput).toHaveAttribute('min', '1');
  //     await expect(ageInput).toHaveAttribute('max', '120');
  //     await expect(ageInput).toHaveAttribute('type', 'number');
  //   });

  //   test('validates phone number format', async ({ page }) => {
  //     const phoneInput = detailsPage.phoneInput;
  //     await expect(phoneInput).toHaveAttribute('type', 'tel');
  //   });

  //   test('allows optional fields to be empty', async ({ page }) => {
  //     // Mock successful save
  //     await page.route('http://localhost:3000/', route => {
  //       if (route.request().method() === 'POST') {
  //         route.fulfill({
  //           status: 200,
  //           contentType: 'application/json',
  //           body: JSON.stringify({ message: 'Details saved successfully' })
  //         });
  //       } else {
  //         route.continue();
  //       }
  //     });
      
  //     // Save without filling any fields
  //     await detailsPage.saveButton.click();
      
  //     // Should be successful since all fields are optional
  //     await expect(detailsPage.successMessage).toContainText('Details saved successfully!');
  //   });
  // });
});