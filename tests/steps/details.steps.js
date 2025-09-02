const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I am on the SignIn page', async function () {
  this.page = await this.browser.newPage();
  await this.page.goto('http://localhost:3000/signin'); // update if different
  await expect(this.page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
});

When('I enter email {string} and password {string}', async function (email, password) {
  await this.page.fill('input[name="email"]', email);
  await this.page.fill('input[name="password"]', password);
});

When('I click {string}', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();
});

Then('I should be redirected to the profile page', async function () {
  await this.page.waitForURL('**/profile');
  await expect(this.page.getByRole('heading', { name: 'My Profile' })).toBeVisible();
});

When('I navigate to the Details Form page', async function () {
  await this.page.goto('http://localhost:3000/edit-profile'); // adjust route
  await expect(this.page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
});

When('I enter my details:', { timeout: 20000 }, async function (dataTable) {
  const details = dataTable.rowsHash();

  if (details.age) await this.page.fill('input[name="age"]', details.age);
  if (details.gender) await this.page.selectOption('select[name="gender"]', details.gender);
  if (details.phone) await this.page.fill('input[name="phone"]', details.phone);
  if (details.address) await this.page.fill('textarea[name="address"]', details.address);
  if (details.city) await this.page.fill('input[name="city"]', details.city);
  if (details.state) await this.page.fill('input[name="state"]', details.state);
  if (details.postal_code) await this.page.fill('input[name="postal_code"]', details.postal_code);
  if (details.occupation) await this.page.fill('input[name="occupation"]', details.occupation);
});

Then('I should see a success message {string}', async function (message) {
  const success = this.page.locator('div.bg-green-100');
  await expect(success).toContainText(message);
});
