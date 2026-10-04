import request from 'supertest';
import app from '../../../app';
import prisma from '../../../utils/prisma';

let userToken: string;
let userId: string;
let adminToken: string;

// Create test users
beforeAll(async () => {
  const userRes = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'purchaseuser@test.com',
      password: 'password123',
      name: 'Purchase User',
    });

  userToken = userRes.body.token;
  userId = userRes.body.user.id;

  const adminRes = await request(app)
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
  await prisma.purchase.deleteMany({
    where: {
      user: {
        email: { contains: '@test.com' },
      },
    },
  });

  await prisma.vehicle.deleteMany({
    where: {
      make: { contains: 'Test' },
    },
  });
});

// Disconnect Prisma
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

describe('Purchase Routes', () => {
  describe('GET /api/purchases', () => {

    it('should return purchase history for authenticated user', async () => {

      // Admin creates a vehicle
      const createRes = await request(app)
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
      await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      // Get purchase history
      const res = await request(app)
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
      const res = await request(app)
        .get('/api/purchases')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.purchases).toBeDefined();
      expect(Array.isArray(res.body.purchases)).toBe(true);
      expect(res.body.purchases.length).toBe(0);
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/purchases');

      expect(res.status).toBe(401);
    });

  });
});