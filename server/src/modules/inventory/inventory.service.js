"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryService = exports.InventoryService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const errorHandler_1 = require("../../middleware/errorHandler");
/**
 * Inventory service.
 * Handles purchase and restock operations that modify vehicle quantities.
 */
class InventoryService {
    /**
     * Purchases a vehicle, decreases its quantity by 1,
     * and creates a purchase history record.
     *
     * @throws AppError if vehicle not found or out of stock.
     */
    async purchaseVehicle(vehicleId, userId) {
        return await prisma_1.default.$transaction(async (tx) => {
            // Find the vehicle
            const vehicle = await tx.vehicle.findUnique({
                where: { id: vehicleId },
            });
            if (!vehicle) {
                throw new errorHandler_1.AppError('Vehicle not found.', 404);
            }
            // Check stock
            if (vehicle.quantity <= 0) {
                throw new errorHandler_1.AppError('Vehicle is out of stock.', 400);
            }
            // Decrease stock only if quantity is greater than 0
            const updated = await tx.vehicle.updateMany({
                where: {
                    id: vehicleId,
                    quantity: {
                        gt: 0,
                    },
                },
                data: {
                    quantity: {
                        decrement: 1,
                    },
                },
            });
            // If no row was updated, vehicle went out of stock
            if (updated.count === 0) {
                throw new errorHandler_1.AppError('Vehicle is out of stock.', 400);
            }
            // Create purchase history record
            const purchase = await tx.purchase.create({
                data: {
                    userId,
                    vehicleId,
                    quantity: 1,
                    priceAtPurchase: vehicle.price,
                    totalAmount: vehicle.price,
                },
            });
            // Get updated vehicle
            const updatedVehicle = await tx.vehicle.findUnique({
                where: { id: vehicleId },
            });
            return {
                message: `Successfully purchased ${vehicle.make} ${vehicle.model}.`,
                vehicle: updatedVehicle,
                purchase,
            };
        });
    }
    /**
     * Restocks a vehicle, increasing its quantity
     * by the specified amount.
     *
     * @throws AppError if vehicle not found.
     */
    async restockVehicle(vehicleId, quantity) {
        const vehicle = await prisma_1.default.vehicle.findUnique({
            where: { id: vehicleId },
        });
        if (!vehicle) {
            throw new errorHandler_1.AppError('Vehicle not found.', 404);
        }
        const updated = await prisma_1.default.vehicle.update({
            where: { id: vehicleId },
            data: {
                quantity: vehicle.quantity + quantity,
            },
        });
        return {
            message: `Successfully restocked ${quantity} units of ${vehicle.make} ${vehicle.model}.`,
            vehicle: updated,
        };
    }
}
exports.InventoryService = InventoryService;
exports.inventoryService = new InventoryService();
