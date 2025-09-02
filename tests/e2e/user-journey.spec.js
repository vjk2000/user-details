import { test, expect } from '@playwright/test';
import { testUsers } from '../fixtures/test-data.js';

test.describe('Complete User Journey', () => {
//   test('complete new user registration and profile setup', async ({ page }) => {
//     const newUser = testUsers.newUser;
    
//     // Start at home page
//     await page.goto('http://localhost:3000/');
    
//     // Step 1: Navigate to sign up
//     await page.click('text=Sign Up');
//     await expect(page.locator('h2')).toContainText('Sign Up');
    
//     // Step 2: Complete sign up form
//     await page.fill('input[name="name"]', newUser.name);
//     await page.fill('input[name="email"]', newUser.email);
//     await page.fill('input[name="password"]', newUser.password);
    
//     // Mock successful sign up
//     await page.route('**/api/signup', route => {
//       route.fulfill({
//         status: 200,
//         contentType: 'application/json',
//         body: JSON.stringify({ message: 'User created successfully' })
//       });
//     });
    
//     await page.click('button:has-text("Sign Up")');
    
//     // Step 3: Verify redirect to sign in with success message
//     await expect(page.locator('.bg-green-100')).toContainText('Account created successfully! Please sign in.');
//     await expect(page.locator('h2')).toContainText('Sign In');
    
//     // Step 4: Sign in with new account
//     await page.fill('input[name="email"]', newUser.email);
//     await page.fill('input[name="password"]', newUser.password);
    
//     // Mock successful sign in
//     await page.route('**/api/signin', route => {
//       route.fulfill({
//         status: 200,
//         contentType: 'application/json',
//         body: JSON.stringify({
//           user: { id: 1, name: newUser.name, email: newUser.email }
//         })
//       });
//     });
    
//     await page.click('button:has-text("Sign In")');
    
//     // Step 5: Verify redirect to profile
//     await expect(page.locator('h2')).toContainText('My Profile');
    
//     // Step 6: Edit profile to add details
//     await page.click('button:has-text("Edit Profile")');
//     await expect(page.locator('h2')).toContainText('Personal Details');
    
//     // Step 7: Fill out personal details
//     const details = newUser.details;
//     await page.fill('input[name="age"]', details.age);
//     await page.selectOption('select[name="gender"]', details.gender);
//     await page.fill('input[name="phone"]', details.phone);
//     await page.fill('textarea[name="address"]', details.address);
//     await page.fill('input[name="city"]', details.city);
//     await page.fill('input[name="state"]', details.state);
//     await page.fill('input[name="postal_code"]', details.postal_code);
//     await page.fill('input[name="occupation"]', details.occupation);
    
//     // Mock successful details save
//     await page.route('**/api/user/*/details', route => {
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
    
//     await page.click('button:has-text("Save Details")');
    
//     // Step 8: Verify success and return to profile
//     await expect(page.locator('.bg-green-100')).toContainText('Details saved successfully!');
//     await expect(page.locator('h2')).toContainText('My Profile');
    
//     // Step 9: Verify profile shows saved information
//     // Mock user details load
//     await page.route('**/api/user/*/details', route => {
//       if (route.request().method() === 'GET') {
//         route.fulfill({
//           status: 200,
//           contentType: 'application/json',
//           body: JSON.stringify(details)
//         });
//       } else {
//         route.continue();
//       }
//     });
    
//     // Refresh to load details
//     await page.reload();
    
//     // Verify details are displayed
//     await expect(page.locator('text=' + details.age)).toBeVisible();
//     await expect(page.locator('text=' + details.phone)).toBeVisible();
//     await expect(page.locator('text=' + details.occupation)).toBeVisible();
    
//     // Step 10: Test logout
//     await page.click('button:has-text("Logout")');
//     await expect(page.locator('h2')).toContainText('Sign In');
//   });

//   test('existing user login and profile management', async ({ page }) => {
//     const existingUser = testUsers.existingUser;
    
//     await page.goto('/');
    
//     // Sign in
//     await page.fill('input[name="email"]', existingUser.email);
//     await page.fill('input[name="password"]', existingUser.password);
    
//     // Mock successful sign in
//     await page.route('**/api/signin', route => {
//       route.fulfill({
//         status: 200,
//         contentType: 'application/json',
//         body: JSON.stringify({
//           user: { id: 2, name: existingUser.name, email: existingUser.email }
//         })
//       });
//     });
    
//     // Mock user details load
//     await page.route('**/api/user/*/details', route => {
//       route.fulfill({
//         status: 200,
//         contentType: 'application/json',
//         body: JSON.stringify({
//           age: 30,
//           gender: 'male',
//           phone: '+0987654321',
//           address: '456 Main St',
//           city: 'Example City',
//           state: 'Example State',
//           postal_code: '54321',
//           occupation: 'Manager'
//         })
//       });
//     });
    
//     await page.click('button:has-text("Sign In")');
    
//     // Verify profile loads with existing data
//     await expect(page.locator('h2')).toContainText('My Profile');
//     await expect(page.locator('text=30')).toBeVisible();
//     await expect(page.locator('text=Manager')).toBeVisible();
    
//     // Edit and update profile
//     await page.click('button:has-text("Edit Profile")');
    
//     // Update occupation
//     await page.fill('input[name="occupation"]', 'Senior Manager');
    
//     // Mock successful update
//     await page.route('**/api/user/*/details', route => {
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
    
//     await page.click('button:has-text("Save Details")');
    
//     // Verify update success
//     await expect(page.locator('.bg-green-100')).toContainText('Details saved successfully!');
//   });
});