export class ApiMocks {
  constructor(page) {
    this.page = page;
  }

  async mockSignUpSuccess() {
    await this.page.route('**/api/signup', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'User created successfully' })
      });
    });
  }

  async mockSignUpError(error = 'User already exists') {
    await this.page.route('**/api/signup', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error })
      });
    });
  }

  async mockSignInSuccess(user = { id: 1, name: 'Test User', email: 'test@example.com' }) {
    await this.page.route('**/api/signin', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user })
      });
    });
  }

  async mockSignInError(error = 'Invalid credentials') {
    await this.page.route('**/api/signin', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error })
      });
    });
  }

  async mockUserDetailsLoad(details = {}) {
    await this.page.route('**/api/user/*/details', route => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(details)
        });
      } else {
        route.continue();
      }
    });
  }

  async mockUserDetailsSave() {
    await this.page.route('**/api/user/*/details', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Details saved successfully' })
        });
      } else {
        route.continue();
      }
    });
  }

  async mockServerError() {
    await this.page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
  }

  async mockSlowResponse(delay = 2000, endpoint = '**/api/**') {
    await this.page.route(endpoint, async route => {
      await new Promise(resolve => setTimeout(resolve, delay));
      await route.continue();
    });
  }
}