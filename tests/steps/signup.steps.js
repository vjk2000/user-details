const { Given, When, Then } = require('@cucumber/cucumber');
// import { SignUpPage } from "../utils/page-objects.js";
const { expect } = require('@playwright/test');
const { SignUpPage } = require('../utils/page-objects');

let page, signUpPage;

Given('I am on the Sign Up page', async function () {
  page = this.page; // page injected from hooks
  signUpPage = new SignUpPage(page);
  await page.goto('http://localhost:3000/');
  await page.click('text=Sign Up');
});

When('I click Sign Up without filling fields', async function () {
  await signUpPage.signUpButton.click();
});

Then('I should see an error message {string}', async function (msg) {
  await expect(signUpPage.errorMessage).toContainText(msg);
});

When(
  'I fill name {string} and email {string} and password {string}',
  async function (name, email, password) {
    await signUpPage.nameInput.fill(name);
    await signUpPage.emailInput.fill(email);
    await signUpPage.passwordInput.fill(password);
  }
);

Then('the email field should require a valid format', async function () {
  await expect(signUpPage.emailInput).toHaveAttribute('type', 'email');
});

Then(
  'the password field should enforce minimum length of {string}',
  async function (minLength) {
    await expect(signUpPage.passwordInput).toHaveAttribute('minLength', minLength);
  }
);

When('I submit empty form', async function () {
  await signUpPage.signUpButton.click();
});

Then('I should see a validation error', async function () {
  await expect(signUpPage.errorMessage).toBeVisible();
});

When('I type {string} into the name field', async function (val) {
  await signUpPage.nameInput.fill(val);
});

Then('the error message should disappear', async function () {
  await expect(signUpPage.errorMessage).not.toBeVisible();
});


When(
  "I enter name {string}, email {string}, and password {string}",
  async function (name, email, password) {
    await this.page.fill('input[name="name"]', name);
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
  }
);


When("I click Sign Up", async function () {
  await this.page.click('button:has-text("Sign Up")');
});


// Then("I should see a success message {string}", async function (message) {
//   const locator = this.page.locator("text=" + message);
//   await expect(locator).toBeVisible({ timeout: 5000 });
// });
