"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../../app"));
const prisma_1 = __importDefault(require("../../../utils/prisma"));
/**
 * Auth Routes Integration Tests
 * Tests the full HTTP request/response cycle for auth endpoints
 * using Supertest against the Express app.
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
describe('Auth Routes', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user and return 201', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({
                email: 'newuser@test.com',
                password: 'password123',
                name: 'Test User',
            });
            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User registered successfully.');
            expect(res.body.user).toBeDefined();
            expect(res.body.user.email).toBe('newuser@test.com');
            expect(res.body.token).toBeDefined();
        });
        it('should return 400 for missing required fields', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({
                email: 'incomplete@test.com',
            });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Validation failed');
            expect(res.body.details).toBeDefined();
        });
        it('should return 400 for invalid email format', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({
                email: 'not-an-email',
                password: 'password123',
                name: 'Test User',
            });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Validation failed');
        });
        it('should return 400 for password shorter than 6 characters', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({
                email: 'shortpw@test.com',
                password: '123',
                name: 'Test User',
            });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Validation failed');
        });
        it('should return 409 for duplicate email', async () => {
            // Register first
            await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({
                email: 'dup@test.com',
                password: 'password123',
                name: 'First User',
            });
            // Attempt duplicate
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({
                email: 'dup@test.com',
                password: 'password456',
                name: 'Second User',
            });
            expect(res.status).toBe(409);
            expect(res.body.error).toContain('already exists');
        });
    });
    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Create a test user
            await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({
                email: 'logintest@test.com',
                password: 'password123',
                name: 'Login Test User',
            });
        });
        it('should login successfully and return 200 with token', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: 'logintest@test.com',
                password: 'password123',
            });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Login successful.');
            expect(res.body.user).toBeDefined();
            expect(res.body.user.email).toBe('logintest@test.com');
            expect(res.body.token).toBeDefined();
        });
        it('should return 401 for wrong password', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: 'logintest@test.com',
                password: 'wrongpassword',
            });
            expect(res.status).toBe(401);
            expect(res.body.error).toContain('Invalid');
        });
        it('should return 401 for non-existent user', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: 'ghost@test.com',
                password: 'password123',
            });
            expect(res.status).toBe(401);
            expect(res.body.error).toContain('Invalid');
        });
        it('should return 400 for missing email', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                password: 'password123',
            });
            expect(res.status).toBe(400);
        });
    });
});
