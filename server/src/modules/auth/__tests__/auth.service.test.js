"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("../auth.service");
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Auth Service Unit Tests
 * Tests the core authentication business logic:
 * - User registration (including duplicate detection and admin role assignment)
 * - User login (including credential validation)
 */
// Clean up test data after each test
afterEach(async () => {
    await prisma_1.default.user.deleteMany({
        where: {
            email: { contains: '@test.com' },
        },
    });
});
// Disconnect Prisma after all tests
afterAll(async () => {
    await prisma_1.default.$disconnect();
});
describe('AuthService', () => {
    describe('register', () => {
        it('should register a new user and return user data with token', async () => {
            const result = await auth_service_1.authService.register({
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
            expect(result.user.password).toBeUndefined();
        });
        it('should hash the password before storing', async () => {
            await auth_service_1.authService.register({
                email: 'hashtest@test.com',
                password: 'password123',
                name: 'Hash Test',
            });
            const user = await prisma_1.default.user.findUnique({
                where: { email: 'hashtest@test.com' },
            });
            expect(user).toBeDefined();
            expect(user.password).not.toBe('password123');
            // Verify it's a valid bcrypt hash
            const isMatch = await bcryptjs_1.default.compare('password123', user.password);
            expect(isMatch).toBe(true);
        });
        it('should throw an error if email already exists', async () => {
            // Register first user
            await auth_service_1.authService.register({
                email: 'duplicate@test.com',
                password: 'password123',
                name: 'First User',
            });
            // Attempt to register with same email
            await expect(auth_service_1.authService.register({
                email: 'duplicate@test.com',
                password: 'password456',
                name: 'Second User',
            })).rejects.toThrow('A user with this email already exists.');
        });
        it('should create an admin user when valid admin secret is provided', async () => {
            const result = await auth_service_1.authService.register({
                email: 'admin@test.com',
                password: 'password123',
                name: 'Admin User',
                adminSecret: process.env.ADMIN_SECRET,
            });
            expect(result.user.role).toBe('ADMIN');
        });
        it('should create a regular user when invalid admin secret is provided', async () => {
            const result = await auth_service_1.authService.register({
                email: 'notadmin@test.com',
                password: 'password123',
                name: 'Regular User',
                adminSecret: 'wrong-secret',
            });
            expect(result.user.role).toBe('USER');
        });
        it('should return a valid JWT token', async () => {
            const result = await auth_service_1.authService.register({
                email: 'tokentest@test.com',
                password: 'password123',
                name: 'Token Test',
            });
            const decoded = jsonwebtoken_1.default.verify(result.token, process.env.JWT_SECRET);
            expect(decoded.email).toBe('tokentest@test.com');
            expect(decoded.id).toBeDefined();
            expect(decoded.role).toBe('USER');
        });
    });
    describe('login', () => {
        beforeEach(async () => {
            // Create a test user for login tests
            await auth_service_1.authService.register({
                email: 'loginuser@test.com',
                password: 'password123',
                name: 'Login User',
            });
        });
        it('should return user data and token on valid credentials', async () => {
            const result = await auth_service_1.authService.login({
                email: 'loginuser@test.com',
                password: 'password123',
            });
            expect(result.user).toBeDefined();
            expect(result.user.email).toBe('loginuser@test.com');
            expect(result.user.name).toBe('Login User');
            expect(result.token).toBeDefined();
            // Password should not be returned
            expect(result.user.password).toBeUndefined();
        });
        it('should throw an error for non-existent email', async () => {
            await expect(auth_service_1.authService.login({
                email: 'nonexistent@test.com',
                password: 'password123',
            })).rejects.toThrow('Invalid email or password.');
        });
        it('should throw an error for wrong password', async () => {
            await expect(auth_service_1.authService.login({
                email: 'loginuser@test.com',
                password: 'wrongpassword',
            })).rejects.toThrow('Invalid email or password.');
        });
        it('should return a valid JWT token on login', async () => {
            const result = await auth_service_1.authService.login({
                email: 'loginuser@test.com',
                password: 'password123',
            });
            const decoded = jsonwebtoken_1.default.verify(result.token, process.env.JWT_SECRET);
            expect(decoded.email).toBe('loginuser@test.com');
            expect(decoded.role).toBe('USER');
        });
    });
});
