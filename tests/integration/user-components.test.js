// // tests/profile.spec.js
// const { test, expect, TEST_USERS, TEST_DETAILS, ProfilePage, DetailsFormPage, NavbarComponent } = require('./fixtures/test-setup');

// test.describe('Profile Management', () => {
//   test.describe('Profile View', () => {
//     test('should display user profile information', async ({ authenticatedPage }) => {
//       const profilePage = new ProfilePage(authenticatedPage);
      
//       // Should already be on profile page from fixture
//       await expect(authenticatedPage.locator('h2')).toHaveText('My Profile');
      
//       // Check user information is displayed
//       await expect(profilePage.userName).toHaveText(TEST_USERS.EXISTING_USER.name);
//       await expect(profilePage.userEmail).toHaveText(TEST_USERS.EXISTING_USER.email);
      
//       // Check that Edit Profile button is visible
//       await expect(profilePage.editButton).toBeVisible();
//     });

//     test('should display existing user details when available', async ({ authenticatedPage }) => {
//       // Navigate to profile page
//       await authenticatedPage.goto('/profile');
      
//       // Check that existing details are displayed (from mock server)
//       await expect(authenticatedPage.locator('text=30')).toBeVisible(); // Age
//       await expect(authenticatedPage.locator('text=Male')).toBeVisible(); // Gender
//       await expect(authenticatedPage.locator('text=+1234567890')).toBeVisible(); // Phone
//       await expect(authenticatedPage.locator('text=Software Engineer')).toBeVisible(); // Occupation
//     });

//     test('should show "Not specified" for empty fields', async ({ page }) => {
//       // Sign in with a user that has no details
//       await page.goto('/signin');
//       await page.fill('input[name="email"]', 'jane@example.com');
//       await page.fill('input[name="password"]', 'password456');
//       await page.click('button[type="button"]:has-text("Sign In")');
      
//       await page.waitForURL('/profile');
      
//       // Check that empty fields show "Not specified"
//       await expect(page.locator('text=Not specified')).toHaveCount(5); // Multiple empty fields
//     });

//     test('should navigate to edit profile when clicking edit button', async ({ authenticatedPage }) => {
//       const profilePage = new ProfilePage(authenticatedPage);
      
//       await profilePage.editProfile();
//       await expect(authenticatedPage).toHaveURL('/edit-profile');
//     });

//     test('should handle profile loading error gracefully', async ({ page }) => {
//       // Mock API failure by going to a non-existent user
//       await page.route('**/api/user/*/details', route => {
//         route.fulfill({
//           status: 500,
//           contentType: 'application/json',
//           body: JSON.stringify({ error: 'Server error' })
//         });
//       });
      
//       // Sign in
//       await page.goto('/signin');
//       await page.fill('input[name="email"]', TEST_USERS.EXISTING_USER.email);
//       await page.fill('input[name="password"]', TEST_USERS.EXISTING_USER.password);
//       await page.click('button[type="button"]:has-text("Sign In")');
      
//       await page.waitForURL('/profile');
      
//       // Should show error message and retry button
//       await expect(page.locator('[class*="bg-red-100"]')).toHaveText('Failed to load user details');
//       await expect(page.locator('button:has-text("Retry")')).toBeVisible();
//     });
//   });

//   test.describe('Profile Editing', () => {
//     test('should load existing details in edit form', async ({ authenticatedPage }) => {
//       const profilePage = new ProfilePage(authenticatedPage);
//       const detailsForm = new DetailsFormPage(authenticatedPage);
      
//       await profilePage.editProfile();
      
//       // Check that form is populated with existing data
//       await expect(detailsForm.ageInput).toHaveValue('30');
//       await expect(detailsForm.genderSelect).toHaveValue('male');
//       await expect(detailsForm.phoneInput).toHaveValue('+1234567890');
//       await expect(detailsForm.occupationInput).toHaveValue('Software Engineer');
//     });

//     test('should successfully save complete profile details', async ({ authenticatedPage }) => {
//       const profilePage = new ProfilePage(authenticatedPage);
//       const detailsForm = new DetailsFormPage(authenticatedPage);
      
//       await profilePage.editProfile