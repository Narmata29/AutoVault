"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inventory_service_1 = require("../inventory.service");
const vehicle_service_1 = require("../../vehicles/vehicle.service");
const prisma_1 = __importDefault(require("../../../utils/prisma"));
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
let testUser;
// Create a test user before each test
beforeEach(async () => {
    testUser = await prisma_1.default.user.create({
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
    await prisma_1.default.purchase.deleteMany({
        where: {
            userId: testUser.id,
        },
    });
    await prisma_1.default.vehicle.deleteMany({
        where: {
            make: { contains: 'Test' },
        },
    });
    await prisma_1.default.user.delete({
        where: {
            id: testUser.id,
        },
    });
});
// Disconnect Prisma after all tests
afterAll(async () => {
    await prisma_1.default.$disconnect();
});
describe('InventoryService', () => {
    describe('purchaseVehicle', () => {
        it('should decrease vehicle quantity by 1', async () => {
            const vehicle = await vehicle_service_1.vehicleService.createVehicle({
                make: 'TestPurchase',
                model: 'BuyMe',
                category: 'Sedan',
                price: 25000,
                quantity: 5,
            });
            const result = await inventory_service_1.inventoryService.purchaseVehicle(vehicle.id, testUser.id);
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
            const vehicle = await vehicle_service_1.vehicleService.createVehicle({
                make: 'TestOutOfStock',
                model: 'NoStock',
                category: 'Sedan',
                price: 25000,
                quantity: 0,
            });
            await expect(inventory_service_1.inventoryService.purchaseVehicle(vehicle.id, testUser.id)).rejects.toThrow('Vehicle is out of stock.');
        });
        it('should throw an error for non-existent vehicle', async () => {
            await expect(inventory_service_1.inventoryService.purchaseVehicle('non-existent-id', testUser.id)).rejects.toThrow('Vehicle not found.');
        });
        it('should handle purchasing the last item', async () => {
            const vehicle = await vehicle_service_1.vehicleService.createVehicle({
                make: 'TestLastItem',
                model: 'LastOne',
                category: 'SUV',
                price: 35000,
                quantity: 1,
            });
            const result = await inventory_service_1.inventoryService.purchaseVehicle(vehicle.id, testUser.id);
            expect(result.vehicle?.quantity).toBe(0);
            // Purchase history should be created
            expect(result.purchase.userId).toBe(testUser.id);
            expect(result.purchase.vehicleId).toBe(vehicle.id);
            // Subsequent purchase should fail
            await expect(inventory_service_1.inventoryService.purchaseVehicle(vehicle.id, testUser.id)).rejects.toThrow('Vehicle is out of stock.');
        });
    });
    describe('restockVehicle', () => {
        it('should increase vehicle quantity by the specified amount', async () => {
            const vehicle = await vehicle_service_1.vehicleService.createVehicle({
                make: 'TestRestock',
                model: 'StockMe',
                category: 'Truck',
                price: 40000,
                quantity: 2,
            });
            const result = await inventory_service_1.inventoryService.restockVehicle(vehicle.id, 10);
            expect(result.vehicle.quantity).toBe(12);
            expect(result.message).toContain('Successfully restocked');
        });
        it('should throw an error for non-existent vehicle', async () => {
            await expect(inventory_service_1.inventoryService.restockVehicle('non-existent-id', 5)).rejects.toThrow('Vehicle not found.');
        });
        it('should restock a vehicle with zero quantity', async () => {
            const vehicle = await vehicle_service_1.vehicleService.createVehicle({
                make: 'TestRestockZero',
                model: 'FromZero',
                category: 'Electric',
                price: 50000,
                quantity: 0,
            });
            const result = await inventory_service_1.inventoryService.restockVehicle(vehicle.id, 3);
            expect(result.vehicle.quantity).toBe(3);
        });
    });
});
