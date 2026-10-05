"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../../app"));
const prisma_1 = __importDefault(require("../../../utils/prisma"));
/**
 * Inventory Routes Integration Tests
 *
 * Tests the full HTTP request/response cycle for inventory endpoints,
 * including authentication and admin authorization.
 */
let userToken;
let adminToken;
// Set up test users before all tests
beforeAll(async () => {
    // Register a regular user
    const userRes = await (0, supertest_1.default)(app_1.default)
        .post('/api/auth/register')
        .send({
        email: 'invuser@test.com',
        password: 'password123',
        name: 'Inventory User',
    });
    userToken = userRes.body.token;
    // Register an admin user
    const adminRes = await (0, supertest_1.default)(app_1.default)
        .post('/api/auth/register')
        .send({
        email: 'invadmin@test.com',
        password: 'password123',
        name: 'Inventory Admin',
        adminSecret: process.env.ADMIN_SECRET,
    });
    adminToken = adminRes.body.token;
});
// Clean up test data after each test
afterEach(async () => {
    // Delete purchases first because Purchase references Vehicle
    await prisma_1.default.purchase.deleteMany({
        where: {
            user: {
                email: { contains: '@test.com' },
            },
        },
    });
    await prisma_1.default.vehicle.deleteMany({
        where: {
            make: { contains: 'Test' },
        },
    });
});
// Clean up everything after all tests
afterAll(async () => {
    // Delete purchases before users
    await prisma_1.default.purchase.deleteMany({
        where: {
            user: {
                email: { contains: '@test.com' },
            },
        },
    });
    await prisma_1.default.user.deleteMany({
        where: {
            email: { contains: '@test.com' },
        },
    });
    await prisma_1.default.$disconnect();
});
describe('Inventory Routes', () => {
    describe('POST /api/vehicles/:id/purchase', () => {
        it('should purchase a vehicle and decrease quantity', async () => {
            // Vehicle creation is admin-only
            const createRes = await (0, supertest_1.default)(app_1.default)
                .post('/api/vehicles')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                make: 'TestPurchaseRoute',
                model: 'BuyMe',
                category: 'Sedan',
                price: 25000,
                quantity: 3,
            });
            const vehicleId = createRes.body.vehicle.id;
            // Regular user purchases vehicle
            const res = await (0, supertest_1.default)(app_1.default)
                .post(`/api/vehicles/${vehicleId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.status).toBe(200);
            expect(res.body.vehicle.quantity).toBe(2);
            expect(res.body.message).toContain('Successfully purchased');
            // Purchase history should be created
            expect(res.body.purchase).toBeDefined();
            expect(res.body.purchase.vehicleId).toBe(vehicleId);
            expect(res.body.purchase.quantity).toBe(1);
            expect(res.body.purchase.totalAmount).toBe(25000);
        });
        it('should return 400 when vehicle is out of stock', async () => {
            const createRes = await (0, supertest_1.default)(app_1.default)
                .post('/api/vehicles')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                make: 'TestOutOfStockRoute',
                model: 'NoStock',
                category: 'Sedan',
                price: 25000,
                quantity: 0,
            });
            const vehicleId = createRes.body.vehicle.id;
            const res = await (0, supertest_1.default)(app_1.default)
                .post(`/api/vehicles/${vehicleId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.status).toBe(400);
            expect(res.body.error).toContain('out of stock');
        });
        it('should return 401 without authentication', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/vehicles/some-id/purchase');
            expect(res.status).toBe(401);
        });
        it('should return 404 for non-existent vehicle', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/vehicles/non-existent-id/purchase')
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.status).toBe(404);
        });
    });
    describe('POST /api/vehicles/:id/restock', () => {
        it('should restock a vehicle when admin', async () => {
            const createRes = await (0, supertest_1.default)(app_1.default)
                .post('/api/vehicles')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                make: 'TestRestockRoute',
                model: 'StockMe',
                category: 'Truck',
                price: 40000,
                quantity: 2,
            });
            const vehicleId = createRes.body.vehicle.id;
            const res = await (0, supertest_1.default)(app_1.default)
                .post(`/api/vehicles/${vehicleId}/restock`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                quantity: 5,
            });
            expect(res.status).toBe(200);
            expect(res.body.vehicle.quantity).toBe(7);
            expect(res.body.message).toContain('Successfully restocked');
        });
        it('should return 403 for non-admin users', async () => {
            // Vehicle must be created by admin
            const createRes = await (0, supertest_1.default)(app_1.default)
                .post('/api/vehicles')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                make: 'TestRestockForbid',
                model: 'NoRestock',
                category: 'Sedan',
                price: 25000,
                quantity: 1,
            });
            const vehicleId = createRes.body.vehicle.id;
            // Regular user tries to restock
            const res = await (0, supertest_1.default)(app_1.default)
                .post(`/api/vehicles/${vehicleId}/restock`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                quantity: 5,
            });
            expect(res.status).toBe(403);
        });
        it('should return 400 for invalid quantity', async () => {
            const createRes = await (0, supertest_1.default)(app_1.default)
                .post('/api/vehicles')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                make: 'TestRestockInvalid',
                model: 'BadQty',
                category: 'Sedan',
                price: 25000,
                quantity: 1,
            });
            const vehicleId = createRes.body.vehicle.id;
            const res = await (0, supertest_1.default)(app_1.default)
                .post(`/api/vehicles/${vehicleId}/restock`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                quantity: -5,
            });
            expect(res.status).toBe(400);
        });
        it('should return 401 without authentication', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/vehicles/some-id/restock')
                .send({
                quantity: 5,
            });
            expect(res.status).toBe(401);
        });
    });
});
