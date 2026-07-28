import request from 'supertest';
import app from '../../../app';
import prisma from '../../../utils/prisma';

/**
 * Inventory Routes Integration Tests
 * Tests the full HTTP request/response cycle for inventory endpoints,
 * including authentication and admin authorization.
 */

let userToken: string;
let adminToken: string;

// Set up test users before all tests
beforeAll(async () => {
  // Register a regular user
  const userRes = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'invuser@test.com',
      password: 'password123',
      name: 'Inventory User',
    });
  userToken = userRes.body.token;

  // Register an admin user
  const adminRes = await request(app)
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
  await prisma.vehicle.deleteMany({
    where: { make: { contains: 'Test' } },
  });
});

// Clean up everything after all tests
afterAll(async () => {
  await prisma.user.deleteMany({
    where: { email: { contains: '@test.com' } },
  });
  await prisma.$disconnect();
});

describe('Inventory Routes', () => {
  describe('POST /api/vehicles/:id/purchase', () => {
    it('should purchase a vehicle and decrease quantity', async () => {
      // Create a vehicle
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          make: 'TestPurchaseRoute',
          model: 'BuyMe',
          category: 'Sedan',
          price: 25000,
          quantity: 3,
        });

      const vehicleId = createRes.body.vehicle.id;

      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.vehicle.quantity).toBe(2);
      expect(res.body.message).toContain('Successfully purchased');
    });

    it('should return 400 when vehicle is out of stock', async () => {
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          make: 'TestOutOfStockRoute',
          model: 'NoStock',
          category: 'Sedan',
          price: 25000,
          quantity: 0,
        });

      const vehicleId = createRes.body.vehicle.id;

      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('out of stock');
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/vehicles/some-id/purchase');

      expect(res.status).toBe(401);
    });

    it('should return 404 for non-existent vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles/non-existent-id/purchase')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    it('should restock a vehicle when admin', async () => {
      const createRes = await request(app)
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

      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.vehicle.quantity).toBe(7);
      expect(res.body.message).toContain('Successfully restocked');
    });

    it('should return 403 for non-admin users', async () => {
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          make: 'TestRestockForbid',
          model: 'NoRestock',
          category: 'Sedan',
          price: 25000,
          quantity: 1,
        });

      const vehicleId = createRes.body.vehicle.id;

      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(403);
    });

    it('should return 400 for invalid quantity', async () => {
      const createRes = await request(app)
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

      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -5 });

      expect(res.status).toBe(400);
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/vehicles/some-id/restock')
        .send({ quantity: 5 });

      expect(res.status).toBe(401);
    });
  });
});
