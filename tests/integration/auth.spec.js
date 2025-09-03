// tests/auth.spec.js
const { test, expect, TEST_USERS, SignUpPage, SignInPage, NavbarComponent } = require('./fixtures/test-setup');

test.describe('Authentication Flow', () => {
  test.describe('Sign Up', () => {
    // test('should successfully create a new account', async ({ page }) => {
    //   const signUpPage = new SignUpPage(page);
      
    //   await page.goto('/signup');
      
    //   // Verify page loaded correctly
    //   await expect(page).toHaveTitle(/React App/);
    //   await expect(page.locator('h2')).toHaveText('Sign Up');
      
    //   // Fill and submit form
    //   await signUpPage.fillForm(TEST_USERS.NEW_USER);
    //   await signUpPage.submit();
      
    //   // Verify success message
    //   await signUpPage.waitForSuccess();
    //   await expect(signUpPage.successMessage).toContainText('Account created successfully');
      
    //   // Verify automatic redirect to sign in page
    //   await page.waitForURL('/signin', { timeout: 3000 });
    // });

    test('should show validation errors for empty fields', async ({ page }) => {
      const signUpPage = new SignUpPage(page);
      
      await page.goto('/signup');
      
      // Submit empty form
      await signUpPage.submit();
      
      // Check for validation error
      await signUpPage.waitForError();
      await expect(signUpPage.errorMessage).toContainText('All fields are required');
    });

    // test('should show error for duplicate email', async ({ page }) => {
    //   const signUpPage = new SignUpPage(page);
      
    //   await page.goto('/signup');
      
    //   // Try to sign up with existing user email
    //   await signUpPage.fillForm({
    //     name: 'Another User',
    //     email: TEST_USERS.EXISTING_USER.email,
    //     password: 'password123'
    //   });
    //   await signUpPage.submit();
      
    //   // Check for duplicate email error
    //   await signUpPage.waitForError();
    //   await expect(signUpPage.errorMessage).toContainText('User with this email already exists');
    // });

    test('should show error for short password', async ({ page }) => {
      const signUpPage = new SignUpPage(page);
      
      await page.goto('/signup');
      
      await signUpPage.fillForm({
        name: 'Test User',
        email: 'test@example.com',
        password: '123'
      });
      await signUpPage.submit();
      
      await signUpPage.waitForError();
      await expect(signUpPage.errorMessage).toContainText('Password must be at least 6 characters');
    });

    test('should navigate to sign in page when clicking sign in link', async ({ page }) => {
      const signUpPage = new SignUpPage(page);
      
      await page.goto('/signup');
      await signUpPage.signInLink.click();
      
      await expect(page).toHaveURL('/signin');
    });

    // test('should disable form during submission', async ({ page }) => {
    //   const signUpPage = new SignUpPage(page);
      
    //   await page.goto('/signup');
      
    //   await signUpPage.fillForm(TEST_USERS.NEW_USER);
      
    //   // Start submission and check loading state
    //   await signUpPage.submit();
      
    //   // Check that button shows loading text
    //   await expect(signUpPage.submitButton).toHaveText('Creating Account...');
    //   await expect(signUpPage.submitButton).toBeDisabled();
      
    //   // Check that inputs are disabled
    //   await expect(signUpPage.nameInput).toBeDisabled();
    //   await expect(signUpPage.emailInput).toBeDisabled();
    //   await expect(signUpPage.passwordInput).toBeDisabled();
    // });
  });

  test.describe('Sign In', () => {
    test('should successfully sign in with valid credentials', async ({ page }) => {
      const signInPage = new SignInPage(page);
      const navbar = new NavbarComponent(page);
      
      await page.goto('/signin');
      
      // Verify page loaded correctly
      await expect(page.locator('h2')).toHaveText('Sign In');
      
      // Fill and submit form
      await signInPage.fillForm(TEST_USERS.EXISTING_USER);
      await signInPage.submit();
      
      // Verify redirect to profile page
      await page.waitForURL('/profile');
      
      // Verify navbar shows authenticated state
      await expect(navbar.welcomeText).toBeVisible();
      await expect(navbar.logoutButton).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      const signInPage = new SignInPage(page);
      
      await page.goto('/signin');
      
      await signInPage.fillForm(TEST_USERS.INVALID_USER);
      await signInPage.submit();
      
      await signInPage.errorMessage.waitFor();
      await expect(signInPage.errorMessage).toContainText('Invalid email or password');
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      const signInPage = new SignInPage(page);
      
      await page.goto('/signin');
      
      await signInPage.submit();
      
      await signInPage.errorMessage.waitFor();
      await expect(signInPage.errorMessage).toContainText('Email and password are required');
    });

    test('should navigate to sign up page when clicking sign up link', async ({ page }) => {
      const signInPage = new SignInPage(page);
      
      await page.goto('/signin');
      await signInPage.signUpLink.click();
      
      await expect(page).toHaveURL('/signup');
    });
  });

  test.describe('Navigation Protection', () => {
    test('should redirect unauthenticated users to sign in', async ({ page }) => {
      await page.goto('/profile');
      await page.waitForURL('/signin');
      
      await page.goto('/edit-profile');
      await page.waitForURL('/signin');
    });

    test('should redirect authenticated users away from auth pages', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/signin');
      await authenticatedPage.waitForURL('/profile');
      
      await authenticatedPage.goto('/signup');
      await authenticatedPage.waitForURL('/profile');
    });
  });

  test.describe('Logout', () => {
    test('should successfully log out user', async ({ authenticatedPage }) => {
      const navbar = new NavbarComponent(authenticatedPage);
      
      await navbar.logout();
      
      // Should redirect to sign in page
      await authenticatedPage.waitForURL('/signin');
      
      // Navbar should show unauthenticated state
      await expect(navbar.signInLink).toBeVisible();
      await expect(navbar.signUpLink).toBeVisible();
    });

    test('should redirect to sign in when accessing protected routes after logout', async ({ authenticatedPage }) => {
      const navbar = new NavbarComponent(authenticatedPage);
      
      // Logout
      await navbar.logout();
      await authenticatedPage.waitForURL('/signin');
      
      // Try to access protected route
      await authenticatedPage.goto('/profile');
      await authenticatedPage.waitForURL('/signin');
    });
  });
});