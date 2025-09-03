// tests/start-mock-server.js
const MockApiServer = require('./mock-api-server');

const server = new MockApiServer();

// Add some test data
server.addTestUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});

server.addTestUser({
  name: 'Jane Smith',
  email: 'jane@example.com',
  password: 'password456'
});

server.addTestUserDetails(1, {
  age: '30',
  gender: 'male',
  phone: '+1234567890',
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  postal_code: '10001',
  occupation: 'Software Engineer'
});

async function start() {
  try {
    await server.start(5000);
    console.log('Mock API server started successfully');
    
    // Keep the server running
    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM, shutting down gracefully');
      await server.stop();
      process.exit(0);
    });
    
    process.on('SIGINT', async () => {
      console.log('Received SIGINT, shutting down gracefully');
      await server.stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Failed to start mock server:', error);
    process.exit(1);
  }
}

start();