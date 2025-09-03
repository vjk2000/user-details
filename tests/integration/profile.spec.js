// tests/profile.spec.js
const { test, expect, TEST_USERS, TEST_DETAILS, ProfilePage, DetailsFormPage, NavbarComponent } = require('./fixtures/test-setup');

test.describe('Profile Management', () => {
  test.describe('Profile View', () => {
    test('should display user profile information', async ({ authenticatedPage }) => {
      const profilePage = new ProfilePage(authenticatedPage);
      
      // Should already be on profile page from fixture
      await expect(authenticatedPage.locator('h2')).toHaveText('My Profile');
      
      // Check user information is displayed
      await expect(profilePage.userName).toHaveText(TEST_USERS.EXISTING_USER.name);
      await expect(profilePage.userEmail).toHaveText(TEST_USERS.EXISTING_USER.email);
      
      // Check that Edit Profile button is visible
      await expect(profilePage.editButton).toBeVisible();
    });

    test('should display existing user details when available', async ({ authenticatedPage }) => {
      // Navigate to profile page
      await authenticatedPage.goto('/profile');
      
      // Check that existing details are displayed (from mock server)
      await expect(authenticatedPage.locator('text=30')).toBeVisible(); // Age
      await expect(authenticatedPage.locator('text=Male')).toBeVisible(); // Gender
      await expect(authenticatedPage.locator('text=+1234567890')).toBeVisible(); // Phone
      await expect(authenticatedPage.locator('text=Software Engineer')).toBeVisible(); // Occupation
    });

    test('should show "Not specified" for empty fields', async ({ page }) => {
      // Sign in with a user that has no details
      await page.goto('/signin');
      await page.fill('input[name="email"]', 'jane@example.com');
      await page.fill('input[name="password"]', 'password456');
      await page.click('button[type="button"]:has-text("Sign In")');
      
      await page.waitForURL('/profile');
      
      // Check that empty fields show "Not specified"
      await expect(page.locator('text=Not specified')).toHaveCount(5); // Multiple empty fields
    });

    test('should navigate to edit profile when clicking edit button', async ({ authenticatedPage }) => {
      const profilePage = new ProfilePage(authenticatedPage);
      
      await profilePage.editProfile();
      await expect(authenticatedPage).toHaveURL('/edit-profile');
    });

    test('should handle profile loading error gracefully', async ({ page }) => {
      // Mock API failure by going to a non-existent user
      await page.route('**/api/user/*/details', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' })
        });
      });
      
      // Sign in
      await page.goto('/signin');
      await page.fill('input[name="email"]', TEST_USERS.EXISTING_USER.email);
      await page.fill('input[name="password"]', TEST_USERS.EXISTING_USER.password);
      await page.click('button[type="button"]:has-text("Sign In")');
      
      await page.waitForURL('/profile');
      
      // Should show error message and retry button
      await expect(page.locator('[class*="bg-red-100"]')).toHaveText('Failed to load user details');
      await expect(page.locator('button:has-text("Retry")')).toBeVisible();
    });
  });

  test.describe('Profile Editing', () => {
    test('should load existing details in edit form', async ({ authenticatedPage }) => {
      const profilePage = new ProfilePage(authenticatedPage);
      const detailsForm = new DetailsFormPage(authenticatedPage);
      
      await profilePage.editProfile();
      
      // Check that form is populated with existing data
      await expect(detailsForm.ageInput).toHaveValue('30');
      await expect(detailsForm.genderSelect).toHaveValue('male');
      await expect(detailsForm.phoneInput).toHaveValue('+1234567890');
      await expect(detailsForm.occupationInput).toHaveValue('Software Engineer');
    });

    test('should successfully save complete profile details', async ({ authenticatedPage }) => {
      const profilePage = new ProfilePage(authenticatedPage);
      const detailsForm = new DetailsFormPage(authenticatedPage);
      
      await profilePage.editProfile();
      
      // Clear existing data and fill new details
      await detailsForm.ageInput.clear();
      await detailsForm.phoneInput.clear();
      await detailsForm.addressInput.clear();
      await detailsForm.cityInput.clear();
      await detailsForm.stateInput.clear();
      await detailsForm.postalCodeInput.clear();
      await detailsForm.occupationInput.clear();
      
      await detailsForm.fillForm(TEST_DETAILS.COMPLETE);
      await detailsForm.submit();
      
      // Verify success message
      await detailsForm.waitForSuccess();
      await expect(detailsForm.successMessage).toContainText('Details saved successfully!');
      
      // Should navigate back to profile view after delay
      await authenticatedPage.waitForURL('/profile', { timeout: 3000 });
      
      // Verify updated details are displayed
      await expect(authenticatedPage.locator('text=25')).toBeVisible(); // Age
      await expect(authenticatedPage.locator('text=Female')).toBeVisible(); // Gender
      await expect(authenticatedPage.locator('text=+1987654321')).toBeVisible(); // Phone
      await expect(authenticatedPage.locator('text=Designer')).toBeVisible(); // Occupation
    });

    test('should successfully save partial profile details', async ({ page }) => {
      // Sign in with user that has no existing details
      await page.goto('/signin');
      await page.fill('input[name="email"]', 'jane@example.com');
      await page.fill('input[name="password"]', 'password456');
      await page.click('button[type="button"]:has-text("Sign In")');
      
      await page.waitForURL('/profile');
      
      const profilePage = new ProfilePage(page);
      const detailsForm = new DetailsFormPage(page);
      
      await profilePage.editProfile();
      
      // Fill only some details
      await detailsForm.fillForm(TEST_DETAILS.PARTIAL);
      await detailsForm.submit();
      
      await detailsForm.waitForSuccess();
      await page.waitForURL('/profile', { timeout: 3000 });
      
      // Verify partial details are saved
      await expect(page.locator('text=35')).toBeVisible(); // Age
      await expect(page.locator('text=Male')).toBeVisible(); // Gender
      await expect(page.locator('text=+1555555555')).toBeVisible(); // Phone
      
      // Verify empty fields still show "Not specified"
      const notSpecifiedElements = page.locator('text=Not specified');
      await expect(notSpecifiedElements).toHaveCount(4); // Address, City, State, Occupation
    });

    test('should validate age input', async ({ authenticatedPage }) => {
      const profilePage = new ProfilePage(authenticatedPage);
      const detailsForm = new DetailsFormPage(authenticatedPage);
      
      await profilePage.editProfile();
      
      // Try to enter invalid age
      await detailsForm.ageInput.fill('-5');
      await detailsForm.submit();
      
      // HTML5 validation should prevent submission
      const validationMessage = await detailsForm.ageInput.evaluate(el => el.validationMessage);
      expect(validationMessage).toBeTruthy();
    });

    test('should handle save error gracefully', async ({ authenticatedPage }) => {
      // Mock API error for save operation
      await authenticatedPage.route('**/api/user/*/details', route => {
        if (route.request().method() === 'POST') {
          route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Server error occurred' })
          });
        } else {
          route.continue();
        }
      });
      
      const profilePage = new ProfilePage(authenticatedPage);
      const detailsForm = new DetailsFormPage(authenticatedPage);
      
      await profilePage.editProfile();
      
      await detailsForm.fillForm({ age: '25' });
      await detailsForm.submit();
      
      // Should show error message
      await expect(detailsForm.errorMessage).toHaveText('Server error occurred');
    });

    test('should disable form during submission', async ({ authenticatedPage }) => {
      // Mock slow API response
      await authenticatedPage.route('**/api/user/*/details', route => {
        if (route.request().method() === 'POST') {
          setTimeout(() => {
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({ message: 'Success' })
            });
          }, 1000);
        } else {
          route.continue();
        }
      });
      
      const profilePage = new ProfilePage(authenticatedPage);
      const detailsForm = new DetailsFormPage(authenticatedPage);
      
      await profilePage.editProfile();
      
      await detailsForm.fillForm({ age: '25' });
      await detailsForm.submit();
      
      // Check loading state
      await expect(detailsForm.submitButton).toHaveText('Saving...');
      await expect(detailsForm.submitButton).toBeDisabled();
    });
  });

  test.describe('Navigation Integration', () => {
    test('should navigate through navbar links correctly', async ({ authenticatedPage }) => {
      const navbar = new NavbarComponent(authenticatedPage);
      
      // Test Profile link
      await navbar.goToProfile();
      await expect(authenticatedPage).toHaveURL('/profile');
      await expect(authenticatedPage.locator('h2')).toHaveText('My Profile');
      
      // Test Edit Profile button
      await navbar.goToEditProfile();
      await expect(authenticatedPage).toHaveURL('/edit-profile');
      await expect(authenticatedPage.locator('h2')).toHaveText('Personal Details');
    });

    test('should show active navigation state', async ({ authenticatedPage }) => {
      const navbar = new NavbarComponent(authenticatedPage);
      
      // Profile page should show active state
      await expect(navbar.profileLink).toHaveClass(/bg-blue-100/);
      
      // Navigate to edit profile
      await navbar.goToEditProfile();
      await expect(navbar.editProfileButton).toHaveClass(/bg-blue-100/);
    });

    test('should handle direct URL access to edit profile', async ({ page }) => {
      // Go directly to edit profile URL while unauthenticated
      await page.goto('/edit-profile');
      
      // Should redirect to sign in
      await page.waitForURL('/signin');
      
      // Sign in
      await page.fill('input[name="email"]', TEST_USERS.EXISTING_USER.email);
      await page.fill('input[name="password"]', TEST_USERS.EXISTING_USER.password);
      await page.click('button[type="button"]:has-text("Sign In")');
      
      // Should go to profile first
      await page.waitForURL('/profile');
      
      // Then manually navigate to edit
      await page.goto('/edit-profile');
      await expect(page.locator('h2')).toHaveText('Personal Details');
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
      
      // Sign in
      await page.goto('/signin');
      await page.fill('input[name="email"]', TEST_USERS.EXISTING_USER.email);
      await page.fill('input[name="password"]', TEST_USERS.EXISTING_USER.password);
      await page.click('button[type="button"]:has-text("Sign In")');
      
      await page.waitForURL('/profile');
      
      // Check that profile cards stack vertically
      const profileSections = page.locator('.bg-gray-50');
      await expect(profileSections).toHaveCount(4);
      
      // Check that grid items stack on mobile
      const gridItems = page.locator('.grid-cols-1');
      await expect(gridItems).toHaveCount(1);
    });

    test('should handle tablet viewport correctly', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
      
      // Sign in and navigate to edit profile
      await page.goto('/signin');
      await page.fill('input[name="email"]', TEST_USERS.EXISTING_USER.email);
      await page.fill('input[name="password"]', TEST_USERS.EXISTING_USER.password);
      await page.click('button[type="button"]:has-text("Sign In")');
      
      await page.waitForURL('/profile');
      await page.click('button:has-text("Edit Profile")');
      
      // Check that form fields use grid layout on tablet
      const gridContainers = page.locator('.md\\:grid-cols-2, .md\\:grid-cols-3');
      await expect(gridContainers).toHaveCount(2);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper form labels and ARIA attributes', async ({ authenticatedPage }) => {
      const profilePage = new ProfilePage(authenticatedPage);
      await profilePage.editProfile();
      
      // Check that all form inputs have proper labels
      const requiredInputs = ['age', 'phone', 'address', 'city', 'state', 'postal_code', 'occupation'];
      
      for (const inputName of requiredInputs) {
        const input = authenticatedPage.locator(`input[name="${inputName}"], textarea[name="${inputName}"]`);
        const label = authenticatedPage.locator(`label`).filter({ hasText: new RegExp(inputName.replace('_', ' '), 'i') });
        
        await expect(input).toBeVisible();
        await expect(label).toBeVisible();
      }
      
      // Check select element has label
      await expect(authenticatedPage.locator('select[name="gender"]')).toBeVisible();
      await expect(authenticatedPage.locator('label:has-text("Gender")')).toBeVisible();
    });

    test('should support keyboard navigation', async ({ authenticatedPage }) => {
      const profilePage = new ProfilePage(authenticatedPage);
      await profilePage.editProfile();
      
      // Tab through form elements
      await authenticatedPage.keyboard.press('Tab');
      await expect(authenticatedPage.locator('input[name="age"]')).toBeFocused();
      
      await authenticatedPage.keyboard.press('Tab');
      await expect(authenticatedPage.locator('select[name="gender"]')).toBeFocused();
      
      await authenticatedPage.keyboard.press('Tab');
      await expect(authenticatedPage.locator('input[name="phone"]')).toBeFocused();
    });

    test('should have sufficient color contrast', async ({ authenticatedPage }) => {
      // This would typically use axe-playwright for comprehensive accessibility testing
      // For now, we'll check that text is visible and readable
      
      const profilePage = new ProfilePage(authenticatedPage);
      await profilePage.editProfile();
      
      // Check that error/success messages are visible
      const labels = authenticatedPage.locator('label');
      const labelCount = await labels.count();
      
      for (let i = 0; i < labelCount; i++) {
        await expect(labels.nth(i)).toBeVisible();
      }
    });
  });
});