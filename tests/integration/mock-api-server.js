// tests/mock-api-server.js
const express = require('express');
const cors = require('cors');

class MockApiServer {
  constructor() {
    this.app = express();
    this.server = null;
    this.users = new Map();
    this.userDetails = new Map();
    this.nextUserId = 1;
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    
    // Request logging middleware
    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`, req.body);
      next();
    });
  }

  setupRoutes() {
    // Health check endpoint
    this.app.get('/api/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    // Sign up endpoint
    this.app.post('/api/signup', (req, res) => {
      const { name, email, password } = req.body;
      
      // Validation
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      
      // Check if user already exists
      for (const user of this.users.values()) {
        if (user.email === email) {
          return res.status(400).json({ error: 'User with this email already exists' });
        }
      }
      
      // Create new user
      const userId = this.nextUserId++;
      const newUser = {
        id: userId,
        name,
        email,
        password // In real app, this would be hashed
      };
      
      this.users.set(userId, newUser);
      
      res.status(201).json({
        message: 'User created successfully',
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      });
    });

    // Sign in endpoint
    this.app.post('/api/signin', (req, res) => {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      // Find user by email
      const user = Array.from(this.users.values()).find(u => u.email === email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      res.json({
        message: 'Sign in successful',
        user: { id: user.id, name: user.name, email: user.email }
      });
    });

    // Get user details endpoint
    this.app.get('/api/user/:id/details', (req, res) => {
      const userId = parseInt(req.params.id);
      
      if (!this.users.has(userId)) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const details = this.userDetails.get(userId) || {
        age: '',
        gender: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        occupation: ''
      };
      
      res.json(details);
    });

    // Save user details endpoint
    this.app.post('/api/user/:id/details', (req, res) => {
      const userId = parseInt(req.params.id);
      
      if (!this.users.has(userId)) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const details = req.body;
      this.userDetails.set(userId, details);
      
      res.json({
        message: 'Details saved successfully',
        details
      });
    });

    // Error handling for test scenarios
    this.app.post('/api/test/error', (req, res) => {
      res.status(500).json({ error: 'Test error' });
    });

    // Slow response for testing loading states
    this.app.post('/api/test/slow', (req, res) => {
      setTimeout(() => {
        res.json({ message: 'Slow response' });
      }, 2000);
    });
  }

  async start(port = 5000) {
    return new Promise((resolve) => {
      this.server = this.app.listen(port, () => {
        console.log(`Mock API server running on port ${port}`);
        resolve();
      });
    });
  }

  async stop() {
    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(() => {
          console.log('Mock API server stopped');
          resolve();
        });
      });
    }
  }

  // Helper methods for tests
  addTestUser(userData) {
    const userId = this.nextUserId++;
    const user = { id: userId, ...userData };
    this.users.set(userId, user);
    return user;
  }

  addTestUserDetails(userId, details) {
    this.userDetails.set(userId, details);
  }

  clearData() {
    this.users.clear();
    this.userDetails.clear();
    this.nextUserId = 1;
  }

  getUserCount() {
    return this.users.size;
  }

  getUser(id) {
    return this.users.get(id);
  }

  getUserDetails(id) {
    return this.userDetails.get(id);
  }
}

module.exports = MockApiServer;