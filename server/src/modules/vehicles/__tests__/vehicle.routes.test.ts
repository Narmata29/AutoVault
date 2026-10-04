import request from 'supertest';
import app from '../../../app';
import prisma from '../../../utils/prisma';

/**
 * Vehicle Routes Integration Tests
 *
 * Tests the full HTTP request/response cycle for vehicle endpoints,
 * including authentication and authorization guards.
 */

let userToken: string;
let adminToken: string;

// Set up test users before all tests
beforeAll(async () => {
  // Register a regular user
  const userRes = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'vehicleuser@test.com',
      password: 'password123',
      name: 'Vehicle User',
    });

  userToken = userRes.body.token;

  // Register an admin user
  const adminRes = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'vehicleadmin@test.com',
      password: 'password123',
      name: 'Vehicle Admin',
      adminSecret: process.env.ADMIN_SECRET,
    });

  adminToken = adminRes.body.token;
});

// Clean up test vehicles after each test
afterEach(async () => {
  await prisma.vehicle.deleteMany({
    where: {
      make: { contains: 'Test' },
    },
  });
});

// Clean up test users after all tests
afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      email: { contains: '@test.com' },
    },
  });

  await prisma.$disconnect();
});

describe('Vehicle Routes', () => {
  describe('POST /api/vehicles', () => {
    it('should create a vehicle when admin', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'TestCreate',
          model: 'Sedan',
          category: 'Sedan',
          price: 25000,
          quantity: 3,
        });

      expect(res.status).toBe(201);
      expect(res.body.vehicle).toBeDefined();
      expect(res.body.vehicle.make).toBe('TestCreate');
    });

    it('should return 403 for non-admin users', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          make: 'TestUserCreate',
          model: 'Model',
          category: 'Sedan',
          price: 25000,
          quantity: 1,
        });

      expect(res.status).toBe(403);
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .send({
          make: 'TestNoAuth',
          model: 'Model',
          category: 'Sedan',
          price: 25000,
          quantity: 1,
        });

      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid vehicle data', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'TestInvalid',
          // Missing required fields
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/vehicles', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'TestList',
          model: 'ListModel',
          category: 'SUV',
          price: 30000,
          quantity: 2,
        });
    });

    it('should return all vehicles when authenticated', async () => {
      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.vehicles).toBeDefined();
      expect(Array.isArray(res.body.vehicles)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/vehicles');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/vehicles/search', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'TestSearch',
          model: 'SearchModel',
          category: 'Electric',
          price: 45000,
          quantity: 4,
        });
    });

    it('should search vehicles by make', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?make=TestSearch')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.vehicles.length).toBeGreaterThanOrEqual(1);
    });

    it('should search vehicles by price range', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?minPrice=40000&maxPrice=50000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);

      res.body.vehicles.forEach((v: any) => {
        expect(v.price).toBeGreaterThanOrEqual(40000);
        expect(v.price).toBeLessThanOrEqual(50000);
      });
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('should update a vehicle when admin', async () => {
      // Create vehicle using admin
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'TestUpdate',
          model: 'BeforeUpdate',
          category: 'Sedan',
          price: 25000,
          quantity: 2,
        });

      const vehicleId = createRes.body.vehicle.id;

      const res = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 28000,
          model: 'AfterUpdate',
        });

      expect(res.status).toBe(200);
      expect(res.body.vehicle.price).toBe(28000);
      expect(res.body.vehicle.model).toBe('AfterUpdate');
    });

    it('should return 403 when non-admin tries to update', async () => {
      // Create vehicle using admin
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'TestUserUpdate',
          model: 'BeforeUpdate',
          category: 'Sedan',
          price: 25000,
          quantity: 2,
        });

      const vehicleId = createRes.body.vehicle.id;

      // Regular user tries to update
      const res = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          price: 28000,
        });

      expect(res.status).toBe(403);
    });

    it('should return 404 for non-existent vehicle', async () => {
      const res = await request(app)
        .put('/api/vehicles/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 30000,
        });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should delete a vehicle when admin', async () => {
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'TestDelete',
          model: 'ToDelete',
          category: 'Sedan',
          price: 25000,
          quantity: 1,
        });

      const vehicleId = createRes.body.vehicle.id;

      const res = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('deleted');
    });

    it('should return 403 for non-admin users', async () => {
      // Vehicle must be created by admin
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'TestForbid',
          model: 'NoDelete',
          category: 'Sedan',
          price: 25000,
          quantity: 1,
        });

      const vehicleId = createRes.body.vehicle.id;

      const res = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .delete('/api/vehicles/some-id');

      expect(res.status).toBe(401);
    });
  });
});