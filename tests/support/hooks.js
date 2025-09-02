const { Before, After } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

Before(async function () {
  this.browser = await chromium.launch({ headless: false ,slowMo: 1000});
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function () {
  await this.browser.close();
});
