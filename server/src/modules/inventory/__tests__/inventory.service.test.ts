import { inventoryService } from '../inventory.service';
import { vehicleService } from '../../vehicles/vehicle.service';
import prisma from '../../../utils/prisma';

/**
 * Inventory Service Unit Tests
 *
 * Tests the inventory management business logic:
 * - Purchasing vehicles (quantity decrease)
 * - Restocking vehicles (quantity increase)
 * - Purchase history creation
 * - Edge cases (out of stock, non-existent vehicle)
 */

// Test user
let testUser: { id: string };

// Create a test user before each test
beforeEach(async () => {
  testUser = await prisma.user.create({
    data: {
      name: 'Test Buyer',
      email: `test-buyer-${Date.now()}-${Math.random()}@example.com`,
      password: 'test-password',
      role: 'USER',
    },
  });
});

// Clean up test data after each test
afterEach(async () => {
  await prisma.purchase.deleteMany({
    where: {
      userId: testUser.id,
    },
  });

  await prisma.vehicle.deleteMany({
    where: {
      make: { contains: 'Test' },
    },
  });

  await prisma.user.delete({
    where: {
      id: testUser.id,
    },
  });
});

// Disconnect Prisma after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

describe('InventoryService', () => {

  describe('purchaseVehicle', () => {

    it('should decrease vehicle quantity by 1', async () => {
      const vehicle = await vehicleService.createVehicle({
        make: 'TestPurchase',
        model: 'BuyMe',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      });

      const result = await inventoryService.purchaseVehicle(
        vehicle.id,
        testUser.id
      );

      expect(result.vehicle?.quantity).toBe(4);
      expect(result.message).toContain('Successfully purchased');

      // Check purchase history
      expect(result.purchase.userId).toBe(testUser.id);
      expect(result.purchase.vehicleId).toBe(vehicle.id);
      expect(result.purchase.quantity).toBe(1);
      expect(result.purchase.priceAtPurchase).toBe(25000);
      expect(result.purchase.totalAmount).toBe(25000);
    });

    it('should throw an error when vehicle is out of stock', async () => {
      const vehicle = await vehicleService.createVehicle({
        make: 'TestOutOfStock',
        model: 'NoStock',
        category: 'Sedan',
        price: 25000,
        quantity: 0,
      });

      await expect(
        inventoryService.purchaseVehicle(
          vehicle.id,
          testUser.id
        )
      ).rejects.toThrow('Vehicle is out of stock.');
    });

    it('should throw an error for non-existent vehicle', async () => {
      await expect(
        inventoryService.purchaseVehicle(
          'non-existent-id',
          testUser.id
        )
      ).rejects.toThrow('Vehicle not found.');
    });

    it('should handle purchasing the last item', async () => {
      const vehicle = await vehicleService.createVehicle({
        make: 'TestLastItem',
        model: 'LastOne',
        category: 'SUV',
        price: 35000,
        quantity: 1,
      });

      const result = await inventoryService.purchaseVehicle(
        vehicle.id,
        testUser.id
      );

      expect(result.vehicle?.quantity).toBe(0);

      // Purchase history should be created
      expect(result.purchase.userId).toBe(testUser.id);
      expect(result.purchase.vehicleId).toBe(vehicle.id);

      // Subsequent purchase should fail
      await expect(
        inventoryService.purchaseVehicle(
          vehicle.id,
          testUser.id
        )
      ).rejects.toThrow('Vehicle is out of stock.');
    });

  });

  describe('restockVehicle', () => {

    it('should increase vehicle quantity by the specified amount', async () => {
      const vehicle = await vehicleService.createVehicle({
        make: 'TestRestock',
        model: 'StockMe',
        category: 'Truck',
        price: 40000,
        quantity: 2,
      });

      const result = await inventoryService.restockVehicle(
        vehicle.id,
        10
      );

      expect(result.vehicle.quantity).toBe(12);
      expect(result.message).toContain('Successfully restocked');
    });

    it('should throw an error for non-existent vehicle', async () => {
      await expect(
        inventoryService.restockVehicle(
          'non-existent-id',
          5
        )
      ).rejects.toThrow('Vehicle not found.');
    });

    it('should restock a vehicle with zero quantity', async () => {
      const vehicle = await vehicleService.createVehicle({
        make: 'TestRestockZero',
        model: 'FromZero',
        category: 'Electric',
        price: 50000,
        quantity: 0,
      });

      const result = await inventoryService.restockVehicle(
        vehicle.id,
        3
      );

      expect(result.vehicle.quantity).toBe(3);
    });

  });

});