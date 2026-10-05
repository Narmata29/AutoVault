"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../../app"));
const prisma_1 = __importDefault(require("../../../utils/prisma"));
let userToken;
let userId;
let adminToken;
// Create test users
beforeAll(async () => {
    const userRes = await (0, supertest_1.default)(app_1.default)
        .post('/api/auth/register')
        .send({
        email: 'purchaseuser@test.com',
        password: 'password123',
        name: 'Purchase User',
    });
    userToken = userRes.body.token;
    userId = userRes.body.user.id;
    const adminRes = await (0, supertest_1.default)(app_1.default)
        .post('/api/auth/register')
        .send({
        email: 'purchaseadmin@test.com',
        password: 'password123',
        name: 'Purchase Admin',
        adminSecret: process.env.ADMIN_SECRET,
    });
    adminToken = adminRes.body.token;
});
// Clean up test data
afterEach(async () => {
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
// Disconnect Prisma
afterAll(async () => {
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
describe('Purchase Routes', () => {
    describe('GET /api/purchases', () => {
        it('should return purchase history for authenticated user', async () => {
            // Admin creates a vehicle
            const createRes = await (0, supertest_1.default)(app_1.default)
                .post('/api/vehicles')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                make: 'TestPurchaseHistory',
                model: 'HistoryCar',
                category: 'Sedan',
                price: 30000,
                quantity: 2,
            });
            const vehicleId = createRes.body.vehicle.id;
            // User purchases the vehicle
            await (0, supertest_1.default)(app_1.default)
                .post(`/api/vehicles/${vehicleId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);
            // Get purchase history
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/api/purchases')
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.status).toBe(200);
            expect(res.body.purchases).toBeDefined();
            expect(Array.isArray(res.body.purchases)).toBe(true);
            expect(res.body.purchases.length).toBe(1);
            const purchase = res.body.purchases[0];
            expect(purchase.userId).toBe(userId);
            expect(purchase.vehicleId).toBe(vehicleId);
            expect(purchase.quantity).toBe(1);
            expect(purchase.priceAtPurchase).toBe(30000);
            expect(purchase.totalAmount).toBe(30000);
            // Vehicle information should also be included
            expect(purchase.vehicle).toBeDefined();
            expect(purchase.vehicle.make).toBe('TestPurchaseHistory');
            expect(purchase.vehicle.model).toBe('HistoryCar');
        });
        it('should return an empty array when user has no purchases', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/api/purchases')
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.status).toBe(200);
            expect(res.body.purchases).toBeDefined();
            expect(Array.isArray(res.body.purchases)).toBe(true);
            expect(res.body.purchases.length).toBe(0);
        });
        it('should return 401 without authentication', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/api/purchases');
            expect(res.status).toBe(401);
        });
    });
});
