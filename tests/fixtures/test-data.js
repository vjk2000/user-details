export const testUsers = {
  newUser: {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
    details: {
      age: '25',
      gender: 'female',
      phone: '+1234567890',
      address: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      postal_code: '12345',
      occupation: 'Test Engineer'
    }
  },
  existingUser: {
    name: 'Existing User',
    email: 'existing@example.com',
    password: 'password123'
  },
  adminUser: {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123'
  }
};

export const apiResponses = {
  signUpSuccess: {
    message: 'User created successfully'
  },
  signInSuccess: {
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com'
    }
  },
  userDetails: {
    age: 25,
    gender: 'female',
    phone: '+1234567890',
    address: '123 Test Street',
    city: 'Test City',
    state: 'Test State',
    postal_code: '12345',
    occupation: 'Test Engineer'
  }
};