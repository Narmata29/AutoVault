import { authService } from '../auth.service';
import prisma from '../../../utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Auth Service Unit Tests
 * Tests the core authentication business logic:
 * - User registration (including duplicate detection and admin role assignment)
 * - User login (including credential validation)
 */

// Clean up test data after each test
afterEach(async () => {
  await prisma.user.deleteMany({
    where: {
      email: { contains: '@test.com' },
    },
  });
});

// Disconnect Prisma after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

describe('AuthService', () => {
  describe('register', () => {
    it('should register a new user and return user data with token', async () => {
      const result = await authService.register({
        email: 'newuser@test.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('newuser@test.com');
      expect(result.user.name).toBe('Test User');
      expect(result.user.role).toBe('USER');
      expect(result.token).toBeDefined();

      // Verify password is not returned
      expect((result.user as any).password).toBeUndefined();
    });

    it('should hash the password before storing', async () => {
      await authService.register({
        email: 'hashtest@test.com',
        password: 'password123',
        name: 'Hash Test',
      });

      const user = await prisma.user.findUnique({
        where: { email: 'hashtest@test.com' },
      });

      expect(user).toBeDefined();
      expect(user!.password).not.toBe('password123');
      // Verify it's a valid bcrypt hash
      const isMatch = await bcrypt.compare('password123', user!.password);
      expect(isMatch).toBe(true);
    });

    it('should throw an error if email already exists', async () => {
      // Register first user
      await authService.register({
        email: 'duplicate@test.com',
        password: 'password123',
        name: 'First User',
      });

      // Attempt to register with same email
      await expect(
        authService.register({
          email: 'duplicate@test.com',
          password: 'password456',
          name: 'Second User',
        })
      ).rejects.toThrow('A user with this email already exists.');
    });

    it('should create an admin user when valid admin secret is provided', async () => {
      const result = await authService.register({
        email: 'admin@test.com',
        password: 'password123',
        name: 'Admin User',
        adminSecret: process.env.ADMIN_SECRET,
      });

      expect(result.user.role).toBe('ADMIN');
    });

    it('should create a regular user when invalid admin secret is provided', async () => {
      const result = await authService.register({
        email: 'notadmin@test.com',
        password: 'password123',
        name: 'Regular User',
        adminSecret: 'wrong-secret',
      });

      expect(result.user.role).toBe('USER');
    });

    it('should return a valid JWT token', async () => {
      const result = await authService.register({
        email: 'tokentest@test.com',
        password: 'password123',
        name: 'Token Test',
      });

      const decoded = jwt.verify(result.token, process.env.JWT_SECRET!) as any;
      expect(decoded.email).toBe('tokentest@test.com');
      expect(decoded.id).toBeDefined();
      expect(decoded.role).toBe('USER');
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await authService.register({
        email: 'loginuser@test.com',
        password: 'password123',
        name: 'Login User',
      });
    });

    it('should return user data and token on valid credentials', async () => {
      const result = await authService.login({
        email: 'loginuser@test.com',
        password: 'password123',
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('loginuser@test.com');
      expect(result.user.name).toBe('Login User');
      expect(result.token).toBeDefined();
      // Password should not be returned
      expect((result.user as any).password).toBeUndefined();
    });

    it('should throw an error for non-existent email', async () => {
      await expect(
        authService.login({
          email: 'nonexistent@test.com',
          password: 'password123',
        })
      ).rejects.toThrow('Invalid email or password.');
    });

    it('should throw an error for wrong password', async () => {
      await expect(
        authService.login({
          email: 'loginuser@test.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid email or password.');
    });

    it('should return a valid JWT token on login', async () => {
      const result = await authService.login({
        email: 'loginuser@test.com',
        password: 'password123',
      });

      const decoded = jwt.verify(result.token, process.env.JWT_SECRET!) as any;
      expect(decoded.email).toBe('loginuser@test.com');
      expect(decoded.role).toBe('USER');
    });
  });
});
