// tests/integration/auth-components.spec.js
import { test, expect } from '@playwright/test';

test.describe('Authentication Components Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Set up common API mocks before each test
    await page.route('**/api/user/*/details', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            age: '',
            gender: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            postal_code: '',
            occupation: ''
          })
        });
      }
    });
  });

  test('SignIn component integrates with API service', async ({ page }) => {
    let apiCallMade = false;
    let apiCallData = null;

    // Mock API response and capture call details
    await page.route('**/api/signin', async (route) => {
      apiCallMade = true;
      apiCallData = {
        url: route.request().url(),
        method: route.request().method(),
        postData: route.request().postData()
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: '123', name: 'John Doe', email: 'john@example.com' }
        })
      });
    });

    // Navigate to sign in page
    await page.goto('http://localhost:3000/');

    // User interaction
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Sign In")');

    // Wait for API call to complete
    await page.waitForTimeout(100);

    // Verify integration - API was called correctly
    expect(apiCallMade).toBe(true);
    expect(apiCallData.method).toBe('POST');
    expect(apiCallData.url).toContain('http://localhost:3000/');
    
    const requestBody = JSON.parse(apiCallData.postData);
    expect(requestBody).toEqual({
      email: 'john@example.com',
      password: 'password123'
    });

    // Verify component response to successful API call
    // Should redirect to details page or show success state
    await expect(page.locator('text=Welcome, John Doe')).toBeVisible({ timeout: 5000 });
  });

  test('SignIn component handles API errors correctly', async ({ page }) => {
    // Mock API error response
    await page.route('**/api/signin', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid credentials' })
      });
    });

    await page.goto('http://localhost:3000/');

    // User interaction
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button:has-text("Sign In")');

    // Verify error handling integration
    await expect(page.locator('.bg-red-100')).toContainText('Invalid credentials');
    
    // Should remain on sign in page
    await expect(page.locator('h2')).toContainText('Sign In');
  });

  test('DetailsForm integrates with user state and API', async ({ page }) => {
    let getApiCalled = false;
    let postApiCalled = false;
    let postApiData = null;

    // Mock GET user details API
    await page.route('**/api/user/123/details', async (route) => {
      if (route.request().method() === 'GET') {
        getApiCalled = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            age: '25',
            gender: 'female',
            phone: '+9876543210',
            address: '456 Oak St',
            city: 'Boston',
            state: 'MA',
            postal_code: '02101',
            occupation: 'Designer'
          })
        });
      } else if (route.request().method() === 'POST') {
        postApiCalled = true;
        postApiData = JSON.parse(route.request().postData());
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
    });

    // Navigate to details form (assuming user is already authenticated)
    await page.goto('http://localhost:3000/');

    // Wait for initial data load
    await page.waitForTimeout(100);

    // Verify GET integration - form should be pre-populated
    expect(getApiCalled).toBe(true);
    await expect(page.locator('input[name="age"]')).toHaveValue('25');
    await expect(page.locator('select[name="gender"]')).toHaveValue('female');
    await expect(page.locator('input[name="phone"]')).toHaveValue('+9876543210');
    await expect(page.locator('textarea[name="address"]')).toHaveValue('456 Oak St');
    await expect(page.locator('input[name="city"]')).toHaveValue('Boston');
    await expect(page.locator('input[name="state"]')).toHaveValue('MA');
    await expect(page.locator('input[name="postal_code"]')).toHaveValue('02101');
    await expect(page.locator('input[name="occupation"]')).toHaveValue('Designer');

    // Modify some fields
    await page.fill('input[name="age"]', '30');
    await page.fill('input[name="phone"]', '+1234567890');
    await page.selectOption('select[name="gender"]', 'male');

    // Submit form
    await page.click('button:has-text("Save Details")');

    // Wait for API call
    await page.waitForTimeout(100);

    // Verify POST integration
    expect(postApiCalled).toBe(true);
    expect(postApiData).toEqual({
      age: '30',
      gender: 'male',
      phone: '+1234567890',
      address: '456 Oak St',
      city: 'Boston',
      state: 'MA',
      postal_code: '02101',
      occupation: 'Designer'
    });

    // Verify success feedback
    await expect(page.locator('.bg-green-100')).toContainText('Details saved successfully');
  });

  test('DetailsForm handles API loading states', async ({ page }) => {
    // Mock delayed POST API
    await page.route('**/api/user/123/details', async (route) => {
      if (route.request().method() === 'POST') {
        // Simulate slow API
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
    });

    await page.goto('http://localhost:3000/');

    // Fill and submit form
    await page.fill('input[name="age"]', '30');
    await page.click('button:has-text("Save Details")');

    // Verify loading state integration
    await expect(page.locator('button:has-text("Saving...")')).toBeVisible();
    await expect(page.locator('button[disabled]')).toBeVisible();

    // Wait for completion
    await expect(page.locator('button:has-text("Save Details")')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('.bg-green-100')).toBeVisible();
  });

  test('ProfileView integrates with API and handles missing data', async ({ page }) => {
    let apiCalled = false;

    // Mock API with partial data
    await page.route('**/api/user/123/details', async (route) => {
      if (route.request().method() === 'GET') {
        apiCalled = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            age: '30',
            gender: 'male',
            phone: '+1234567890',
            address: '', // Empty
            city: 'New York',
            state: '', // Empty
            postal_code: '10001',
            occupation: '' // Empty
          })
        });
      }
    });

    await page.goto('http://localhost:3000/');

    // Wait for API call
    await page.waitForTimeout(100);

    // Verify API integration
    expect(apiCalled).toBe(true);

    // Verify data display integration
    await expect(page.locator('text=30')).toBeVisible(); // Age displayed
    await expect(page.locator('text=Male')).toBeVisible(); // Gender formatted
    await expect(page.locator('text=+1234567890')).toBeVisible(); // Phone displayed
    await expect(page.locator('text=New York')).toBeVisible(); // City in badge
    await expect(page.locator('text=10001')).toBeVisible(); // Postal code in badge

    // Verify missing data handling
    await expect(page.locator('text=Not specified')).toHaveCount(2); // For empty occupation and address section
  });

  test('Component navigation integration', async ({ page }) => {
    // Mock APIs for all components
    await page.route('**/api/signin', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: '123', name: 'John Doe', email: 'john@example.com' }
        })
      });
    });

    await page.route('**/api/user/123/details', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            age: '30',
            gender: 'male',
            phone: '+1234567890',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            postal_code: '10001',
            occupation: 'Software Engineer'
          })
        });
      } else if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
    });

    // Start at sign in
    await page.goto('http://localhost:3000/');

    // Sign in flow
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Sign In")');

    // Should navigate to details form
    await expect(page.locator('h2')).toContainText('Personal Details');

    // Complete details and navigate to profile
    await page.click('button:has-text("Save Details")');
    await expect(page.locator('.bg-green-100')).toBeVisible();

    // Should eventually navigate to profile view
    await expect(page.locator('h2')).toContainText('My Profile', { timeout: 3000 });

    // Test edit navigation
    await page.click('button:has-text("Edit Profile")');
    await expect(page.locator('h2')).toContainText('Personal Details');

    // Verify data persistence across navigation
    await expect(page.locator('input[name="age"]')).toHaveValue('30');
    await expect(page.locator('input[name="phone"]')).toHaveValue('+1234567890');
  });

  test('Error boundaries and component resilience', async ({ page }) => {
    // Mock API that fails initially then succeeds
    let callCount = 0;
    
    await page.route('**/api/user/123/details', async (route) => {
      if (route.request().method() === 'GET') {
        callCount++;
        if (callCount === 1) {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Server error' })
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              age: '30',
              gender: 'male',
              phone: '+1234567890',
              address: '123 Main St',
              city: 'New York',
              state: 'NY',
              postal_code: '10001',
              occupation: 'Software Engineer'
            })
          });
        }
      }
    });

    await page.goto('http://localhost:3000/');

    // Should show error state
    await expect(page.locator('.bg-red-100')).toContainText('Failed to load user details');
    await expect(page.locator('button:has-text("Retry")')).toBeVisible();

    // Test retry functionality
    await page.click('button:has-text("Retry")');

    // Should successfully load on retry
    await expect(page.locator('h2')).toContainText('My Profile');
    await expect(page.locator('text=Software Engineer')).toBeVisible();
  });

  test('Form validation integration across components', async ({ page }) => {
    await page.goto('/signin');

    // Test SignIn validation
    await page.click('button:has-text("Sign In")');
    await expect(page.locator('.bg-red-100')).toContainText('Email and password are required');

    // Switch to SignUp
    await page.click('text=Sign Up');
    await expect(page.locator('h2')).toContainText('Sign Up');

    // Test SignUp validation
    await page.click('button:has-text("Sign Up")');
    await expect(page.locator('.bg-red-100')).toContainText('All fields are required');

    // Test partial form completion
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.click('button:has-text("Sign Up")');
    await expect(page.locator('.bg-red-100')).toContainText('All fields are required');

    // Complete form
    await page.fill('input[name="password"]', 'password123');
    
    // Mock successful signup
    await page.route('**/api/signup', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    await page.click('button:has-text("Sign Up")');
    await expect(page.locator('.bg-green-100')).toContainText('Account created successfully');
  });
});