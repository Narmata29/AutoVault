"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vehicle_service_1 = require("../vehicle.service");
const prisma_1 = __importDefault(require("../../../utils/prisma"));
/**
 * Vehicle Service Unit Tests
 * Tests the core vehicle business logic:
 * - CRUD operations (create, read, update, delete)
 * - Search/filter functionality
 */
// Clean up test vehicles after each test
afterEach(async () => {
    await prisma_1.default.vehicle.deleteMany({
        where: {
            make: { contains: 'Test' },
        },
    });
});
// Disconnect Prisma after all tests
afterAll(async () => {
    await prisma_1.default.$disconnect();
});
describe('VehicleService', () => {
    describe('createVehicle', () => {
        it('should create a new vehicle and return it', async () => {
            const vehicleData = {
                make: 'TestMake',
                model: 'TestModel',
                category: 'Sedan',
                price: 25000,
                quantity: 5,
            };
            const vehicle = await vehicle_service_1.vehicleService.createVehicle(vehicleData);
            expect(vehicle).toBeDefined();
            expect(vehicle.id).toBeDefined();
            expect(vehicle.make).toBe('TestMake');
            expect(vehicle.model).toBe('TestModel');
            expect(vehicle.category).toBe('Sedan');
            expect(vehicle.price).toBe(25000);
            expect(vehicle.quantity).toBe(5);
        });
        it('should default quantity to 0 if not provided', async () => {
            const vehicleData = {
                make: 'TestMake',
                model: 'TestDefault',
                category: 'SUV',
                price: 30000,
            };
            const vehicle = await vehicle_service_1.vehicleService.createVehicle(vehicleData);
            expect(vehicle.quantity).toBe(0);
        });
    });
    describe('getAllVehicles', () => {
        it('should return all vehicles', async () => {
            // Create test vehicles
            await vehicle_service_1.vehicleService.createVehicle({
                make: 'TestMake',
                model: 'Model1',
                category: 'Sedan',
                price: 20000,
                quantity: 2,
            });
            await vehicle_service_1.vehicleService.createVehicle({
                make: 'TestMake',
                model: 'Model2',
                category: 'SUV',
                price: 35000,
                quantity: 1,
            });
            const vehicles = await vehicle_service_1.vehicleService.getAllVehicles();
            expect(vehicles.vehicles.length).toBeGreaterThanOrEqual(2);
        });
    });
    describe('getVehicleById', () => {
        it('should return a vehicle by ID', async () => {
            const created = await vehicle_service_1.vehicleService.createVehicle({
                make: 'TestMake',
                model: 'FindMe',
                category: 'Truck',
                price: 40000,
                quantity: 3,
            });
            const found = await vehicle_service_1.vehicleService.getVehicleById(created.id);
            expect(found.id).toBe(created.id);
            expect(found.model).toBe('FindMe');
        });
        it('should throw an error for non-existent ID', async () => {
            await expect(vehicle_service_1.vehicleService.getVehicleById('non-existent-id')).rejects.toThrow('Vehicle not found.');
        });
    });
    describe('searchVehicles', () => {
        beforeEach(async () => {
            await vehicle_service_1.vehicleService.createVehicle({
                make: 'TestToyota',
                model: 'Camry',
                category: 'Sedan',
                price: 28000,
                quantity: 5,
            });
            await vehicle_service_1.vehicleService.createVehicle({
                make: 'TestHonda',
                model: 'CR-V',
                category: 'SUV',
                price: 35000,
                quantity: 3,
            });
            await vehicle_service_1.vehicleService.createVehicle({
                make: 'TestToyota',
                model: 'RAV4',
                category: 'SUV',
                price: 32000,
                quantity: 4,
            });
        });
        it('should search by make', async () => {
            const vehicles = await vehicle_service_1.vehicleService.searchVehicles({ make: 'TestToyota' });
            expect(vehicles.length).toBe(2);
            vehicles.forEach((v) => {
                expect(v.make).toBe('TestToyota');
            });
        });
        it('should search by category', async () => {
            const vehicles = await vehicle_service_1.vehicleService.searchVehicles({ category: 'SUV' });
            expect(vehicles.length).toBeGreaterThanOrEqual(2);
            vehicles.forEach((v) => {
                expect(v.category.toLowerCase()).toContain('suv');
            });
        });
        it('should search by price range', async () => {
            const vehicles = await vehicle_service_1.vehicleService.searchVehicles({
                minPrice: 30000,
                maxPrice: 36000,
            });
            vehicles.forEach((v) => {
                expect(v.price).toBeGreaterThanOrEqual(30000);
                expect(v.price).toBeLessThanOrEqual(36000);
            });
        });
        it('should search by model', async () => {
            const vehicles = await vehicle_service_1.vehicleService.searchVehicles({ model: 'Camry' });
            expect(vehicles.length).toBeGreaterThanOrEqual(1);
            vehicles.forEach((v) => {
                expect(v.model.toLowerCase()).toContain('camry');
            });
        });
        it('should return all vehicles when no filters are provided', async () => {
            const vehicles = await vehicle_service_1.vehicleService.searchVehicles({});
            expect(vehicles.length).toBeGreaterThanOrEqual(3);
        });
    });
    describe('updateVehicle', () => {
        it('should update a vehicle and return the updated data', async () => {
            const created = await vehicle_service_1.vehicleService.createVehicle({
                make: 'TestMake',
                model: 'ToUpdate',
                category: 'Sedan',
                price: 25000,
                quantity: 2,
            });
            const updated = await vehicle_service_1.vehicleService.updateVehicle(created.id, {
                price: 27000,
                quantity: 5,
            });
            expect(updated.price).toBe(27000);
            expect(updated.quantity).toBe(5);
            expect(updated.make).toBe('TestMake'); // Unchanged fields persist
        });
        it('should throw an error for non-existent vehicle', async () => {
            await expect(vehicle_service_1.vehicleService.updateVehicle('non-existent-id', { price: 30000 })).rejects.toThrow('Vehicle not found.');
        });
    });
    describe('deleteVehicle', () => {
        it('should delete a vehicle and return success message', async () => {
            const created = await vehicle_service_1.vehicleService.createVehicle({
                make: 'TestMake',
                model: 'ToDelete',
                category: 'Sedan',
                price: 25000,
                quantity: 1,
            });
            const result = await vehicle_service_1.vehicleService.deleteVehicle(created.id);
            expect(result.message).toBe('Vehicle deleted successfully.');
            // Verify deletion
            await expect(vehicle_service_1.vehicleService.getVehicleById(created.id)).rejects.toThrow('Vehicle not found.');
        });
        it('should throw an error for non-existent vehicle', async () => {
            await expect(vehicle_service_1.vehicleService.deleteVehicle('non-existent-id')).rejects.toThrow('Vehicle not found.');
        });
    });
});
