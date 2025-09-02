class SignInPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.signInButton = page.locator('button:has-text("Sign In")');
    this.signUpLink = page.locator('text=Sign Up');
    this.errorMessage = page.locator('.bg-red-100');
    this.loadingButton = page.locator('button:has-text("Signing In...")');
  }

  async goto() {
    await this.page.goto('/');
  }

  async signIn(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async switchToSignUp() {
    await this.signUpLink.click();
  }
}

class SignUpPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.signUpButton = page.locator('button:has-text("Sign Up")');
    this.signInLink = page.locator('text=Sign In');
    this.errorMessage = page.locator('.bg-red-100');
    this.successMessage = page.locator('.bg-green-100');
    this.loadingButton = page.locator('button:has-text("Creating Account...")');
  }

  async signUp(name, email, password) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signUpButton.click();
  }

  async switchToSignIn() {
    await this.signInLink.click();
  }
}

class ProfilePage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h2:has-text("My Profile")');
    this.editProfileButton = page.locator('button:has-text("Edit Profile")');
    this.logoutButton = page.locator('button:has-text("Logout")');
    this.basicInfoSection = page.locator('text=Basic Information');
    this.contactInfoSection = page.locator('text=Contact Information');
    this.professionalInfoSection = page.locator('text=Professional Information');
    this.accountInfoSection = page.locator('text=Account Information');
  }

  async editProfile() {
    await this.editProfileButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}

class DetailsFormPage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h2:has-text("Personal Details")');
    this.ageInput = page.locator('input[name="age"]');
    this.genderSelect = page.locator('select[name="gender"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.addressTextarea = page.locator('textarea[name="address"]');
    this.cityInput = page.locator('input[name="city"]');
    this.stateInput = page.locator('input[name="state"]');
    this.postalCodeInput = page.locator('input[name="postal_code"]');
    this.occupationInput = page.locator('input[name="occupation"]');
    this.saveButton = page.locator('button:has-text("Save Details")');
    this.logoutButton = page.locator('button:has-text("Logout")');
    this.errorMessage = page.locator('.bg-red-100');
    this.successMessage = page.locator('.bg-green-100');
    this.loadingButton = page.locator('button:has-text("Saving...")');
  }

  async fillDetails(details) {
    if (details.age) await this.ageInput.fill(details.age);
    if (details.gender) await this.genderSelect.selectOption(details.gender);
    if (details.phone) await this.phoneInput.fill(details.phone);
    if (details.address) await this.addressTextarea.fill(details.address);
    if (details.city) await this.cityInput.fill(details.city);
    if (details.state) await this.stateInput.fill(details.state);
    if (details.postal_code) await this.postalCodeInput.fill(details.postal_code);
    if (details.occupation) await this.occupationInput.fill(details.occupation);
  }

  async saveDetails() {
    await this.saveButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = {
  SignInPage,
  SignUpPage,
  ProfilePage,
  DetailsFormPage
};
