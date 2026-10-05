"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../../app"));
const prisma_1 = __importDefault(require("../../../utils/prisma"));
let userToken;
let adminToken;
// Create test users
beforeAll(async () => {
    // Regular user
    const userRes = await (0, supertest_1.default)(app_1.default)
        .post('/api/auth/register')
        .send({
        email: 'analyticsuser@test.com',
        password: 'password123',
        name: 'Analytics User',
    });
    userToken = userRes.body.token;
    // Admin user
    const adminRes = await (0, supertest_1.default)(app_1.default)
        .post('/api/auth/register')
        .send({
        email: 'analyticsadmin@test.com',
        password: 'password123',
        name: 'Analytics Admin',
        adminSecret: process.env.ADMIN_SECRET,
    });
    adminToken = adminRes.body.token;
});
// Clean test data
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
            make: { contains: 'TestAnalytics' },
        },
    });
});
// Clean users and disconnect Prisma
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
describe('Admin Routes', () => {
    describe('GET /api/admin/analytics', () => {
        it('should return analytics for admin users', async () => {
            // Create test vehicle
            const vehicleRes = await (0, supertest_1.default)(app_1.default)
                .post('/api/vehicles')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                make: 'TestAnalyticsBMW',
                model: 'X5',
                category: 'SUV',
                price: 62000,
                quantity: 3,
            });
            expect(vehicleRes.status).toBe(201);
            const vehicleId = vehicleRes.body.vehicle.id;
            // Make a purchase
            const purchaseRes = await (0, supertest_1.default)(app_1.default)
                .post(`/api/vehicles/${vehicleId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(purchaseRes.status).toBe(200);
            // Get analytics
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/api/admin/analytics')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(res.body.analytics).toBeDefined();
            expect(res.body.analytics.totalVehicles).toBeGreaterThanOrEqual(1);
            expect(res.body.analytics.totalStock).toBeGreaterThanOrEqual(2);
            expect(res.body.analytics.totalOrders).toBeGreaterThanOrEqual(1);
            expect(res.body.analytics.totalSales).toBeGreaterThanOrEqual(1);
            expect(res.body.analytics.totalRevenue).toBeGreaterThanOrEqual(62000);
            expect(res.body.analytics.inventoryValue).toBeGreaterThanOrEqual(124000);
            expect(res.body.analytics.salesByCategory).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    category: 'SUV',
                }),
            ]));
            expect(res.body.analytics.recentPurchases).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    vehicle: expect.objectContaining({
                        make: 'TestAnalyticsBMW',
                        model: 'X5',
                    }),
                }),
            ]));
        });
        it('should return 403 for non-admin users', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/api/admin/analytics')
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.status).toBe(403);
        });
        it('should return 401 without authentication', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/api/admin/analytics');
            expect(res.status).toBe(401);
        });
    });
});
