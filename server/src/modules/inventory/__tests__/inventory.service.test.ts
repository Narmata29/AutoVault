import { inventoryService } from '../inventory.service';
import { vehicleService } from '../../vehicles/vehicle.service';
import prisma from '../../../utils/prisma';

/**
 * Inventory Service Unit Tests
 * Tests the inventory management business logic:
 * - Purchasing vehicles (quantity decrease)
 * - Restocking vehicles (quantity increase)
 * - Edge cases (out of stock, non-existent vehicle)
 */

// Clean up test vehicles after each test
afterEach(async () => {
  await prisma.vehicle.deleteMany({
    where: { make: { contains: 'Test' } },
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

      const result = await inventoryService.purchaseVehicle(vehicle.id);

      expect(result.vehicle.quantity).toBe(4);
      expect(result.message).toContain('Successfully purchased');
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
        inventoryService.purchaseVehicle(vehicle.id)
      ).rejects.toThrow('Vehicle is out of stock.');
    });

    it('should throw an error for non-existent vehicle', async () => {
      await expect(
        inventoryService.purchaseVehicle('non-existent-id')
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

      const result = await inventoryService.purchaseVehicle(vehicle.id);
      expect(result.vehicle.quantity).toBe(0);

      // Subsequent purchase should fail
      await expect(
        inventoryService.purchaseVehicle(vehicle.id)
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

      const result = await inventoryService.restockVehicle(vehicle.id, 10);

      expect(result.vehicle.quantity).toBe(12);
      expect(result.message).toContain('Successfully restocked');
    });

    it('should throw an error for non-existent vehicle', async () => {
      await expect(
        inventoryService.restockVehicle('non-existent-id', 5)
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

      const result = await inventoryService.restockVehicle(vehicle.id, 3);

      expect(result.vehicle.quantity).toBe(3);
    });
  });
});
