const { Given, When, Then } = require('@cucumber/cucumber');
// import { SignInPage } from "../utils/page-objects.js";
const { expect } = require('@playwright/test');
const { SignInPage } = require('../utils/page-objects');

let page, signInPage;

Given('I am on the Sign In page', async function () {
  page = this.page;
  signInPage = new SignInPage(page);
  await page.goto('http://localhost:3000/');
});

When('I click Sign In without filling fields', async function () {
  await signInPage.signInButton.click();
});

Then('I should see an error message an {string}', async function (msg) {
  await expect(signInPage.errorMessage).toContainText(msg);
});

Then('the email input should be of type {string} and required', async function (type) {
  await expect(signInPage.emailInput).toHaveAttribute('type', type);
  await expect(signInPage.emailInput).toHaveAttribute('required');
});

Then('the password input should be of type {string} and required', async function (type) {
  await expect(signInPage.passwordInput).toHaveAttribute('type', type);
  await expect(signInPage.passwordInput).toHaveAttribute('required');
});


