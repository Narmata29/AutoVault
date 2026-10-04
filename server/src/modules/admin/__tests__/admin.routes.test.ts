import request from 'supertest';
import app from '../../../app';
import prisma from '../../../utils/prisma';

let userToken: string;
let adminToken: string;

// Create test users
beforeAll(async () => {
  // Regular user
  const userRes = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'analyticsuser@test.com',
      password: 'password123',
      name: 'Analytics User',
    });

  userToken = userRes.body.token;

  // Admin user
  const adminRes = await request(app)
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
  await prisma.purchase.deleteMany({
    where: {
      user: {
        email: { contains: '@test.com' },
      },
    },
  });

  await prisma.vehicle.deleteMany({
    where: {
      make: { contains: 'TestAnalytics' },
    },
  });
});

// Clean users and disconnect Prisma
afterAll(async () => {
  await prisma.purchase.deleteMany({
    where: {
      user: {
        email: { contains: '@test.com' },
      },
    },
  });

  await prisma.user.deleteMany({
    where: {
      email: { contains: '@test.com' },
    },
  });

  await prisma.$disconnect();
});

describe('Admin Routes', () => {
  describe('GET /api/admin/analytics', () => {

    it('should return analytics for admin users', async () => {
      // Create test vehicle
      const vehicleRes = await request(app)
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
      const purchaseRes = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(purchaseRes.status).toBe(200);

      // Get analytics
      const res = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      expect(res.body.analytics).toBeDefined();

      expect(res.body.analytics.totalVehicles).toBeGreaterThanOrEqual(1);

      expect(res.body.analytics.totalStock).toBeGreaterThanOrEqual(2);

      expect(res.body.analytics.totalOrders).toBeGreaterThanOrEqual(1);

      expect(res.body.analytics.totalSales).toBeGreaterThanOrEqual(1);

      expect(res.body.analytics.totalRevenue).toBeGreaterThanOrEqual(62000);

      expect(
        res.body.analytics.inventoryValue
      ).toBeGreaterThanOrEqual(124000);

      expect(
        res.body.analytics.salesByCategory
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            category: 'SUV',
          }),
        ])
      );

      expect(
        res.body.analytics.recentPurchases
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            vehicle: expect.objectContaining({
              make: 'TestAnalyticsBMW',
              model: 'X5',
            }),
          }),
        ])
      );
    });

    it('should return 403 for non-admin users', async () => {
      const res = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/admin/analytics');

      expect(res.status).toBe(401);
    });
  });
});