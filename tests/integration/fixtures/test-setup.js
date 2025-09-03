// tests/fixtures/test-setup.js
const { test: baseTest, expect } = require('@playwright/test');

// Test data constants
const TEST_USERS = {
  NEW_USER: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  },
  EXISTING_USER: {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  },
  INVALID_USER: {
    email: 'nonexistent@example.com',
    password: 'wrongpassword'
  }
};

const TEST_DETAILS = {
  COMPLETE: {
    age: '25',
    gender: 'female',
    phone: '+1987654321',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    postal_code: '90210',
    occupation: 'Designer'
  },
  PARTIAL: {
    age: '35',
    gender: 'male',
    phone: '+1555555555'
  }
};

// Custom test fixture with authentication helper
const test = baseTest.extend({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to sign in page
    await page.goto('/signin');
    
    // Fill in login form
    await page.fill('input[name="email"]', TEST_USERS.EXISTING_USER.email);
    await page.fill('input[name="password"]', TEST_USERS.EXISTING_USER.password);
    
    // Submit form
    await page.click('button[type="button"]:has-text("Sign In")');
    
    // Wait for navigation to profile page
    await page.waitForURL('/profile');
    
    await use(page);
  }
});

// Page Object Models
class SignUpPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="button"]:has-text("Sign Up")');
    this.signInLink = page.locator('button:has-text("Sign In")');
    this.errorMessage = page.locator('[class*="bg-red-100"]');
    this.successMessage = page.locator('[class*="bg-green-100"]');
  }

  async fillForm(userData) {
    await this.nameInput.fill(userData.name || '');
    await this.emailInput.fill(userData.email || '');
    await this.passwordInput.fill(userData.password || '');
  }

  async submit() {
    await this.submitButton.click();
  }

  async waitForSuccess() {
    await this.successMessage.waitFor();
  }

  async waitForError() {
    await this.errorMessage.waitFor();
  }
}

class SignInPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="button"]:has-text("Sign In")');
    this.signUpLink = page.locator('button:has-text("Sign Up")');
    this.errorMessage = page.locator('[class*="bg-red-100"]');
    this.successMessage = page.locator('[class*="bg-green-100"]');
  }

  async fillForm(userData) {
    await this.emailInput.fill(userData.email || '');
    await this.passwordInput.fill(userData.password || '');
  }

  async submit() {
    await this.submitButton.click();
  }
}

class ProfilePage {
  constructor(page) {
    this.page = page;
    this.editButton = page.locator('button:has-text("Edit Profile")');
    this.logoutButton = page.locator('button:has-text("Logout")');
    this.userName = page.locator('text=Full Name').locator('..').locator('p').nth(1);
    this.userEmail = page.locator('text=Email').locator('..').locator('p').nth(1);
  }

  async editProfile() {
    await this.editButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}

class DetailsFormPage {
  constructor(page) {
    this.page = page;
    this.ageInput = page.locator('input[name="age"]');
    this.genderSelect = page.locator('select[name="gender"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.addressInput = page.locator('textarea[name="address"]');
    this.cityInput = page.locator('input[name="city"]');
    this.stateInput = page.locator('input[name="state"]');
    this.postalCodeInput = page.locator('input[name="postal_code"]');
    this.occupationInput = page.locator('input[name="occupation"]');
    this.submitButton = page.locator('button:has-text("Save Details")');
    this.successMessage = page.locator('[class*="bg-green-100"]');
    this.errorMessage = page.locator('[class*="bg-red-100"]');
  }

  async fillForm(details) {
    if (details.age) await this.ageInput.fill(details.age);
    if (details.gender) await this.genderSelect.selectOption(details.gender);
    if (details.phone) await this.phoneInput.fill(details.phone);
    if (details.address) await this.addressInput.fill(details.address);
    if (details.city) await this.cityInput.fill(details.city);
    if (details.state) await this.stateInput.fill(details.state);
    if (details.postal_code) await this.postalCodeInput.fill(details.postal_code);
    if (details.occupation) await this.occupationInput.fill(details.occupation);
  }

  async submit() {
    await this.submitButton.click();
  }

  async waitForSuccess() {
    await this.successMessage.waitFor();
  }
}

class NavbarComponent {
  constructor(page) {
    this.page = page;
    this.profileLink = page.locator('a:has-text("Profile")');
    this.editProfileButton = page.locator('button:has-text("Edit Profile")');
    this.signInLink = page.locator('a:has-text("Sign In")');
    this.signUpLink = page.locator('a:has-text("Sign Up")');
    this.logoutButton = page.locator('button:has-text("Sign Out")');
    this.welcomeText = page.locator('text=Welcome,');
  }

  async goToProfile() {
    await this.profileLink.click();
  }

  async goToEditProfile() {
    await this.editProfileButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = {
  test,
  expect,
  TEST_USERS,
  TEST_DETAILS,
  SignUpPage,
  SignInPage,
  ProfilePage,
  DetailsFormPage,
  NavbarComponent
};