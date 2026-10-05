"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryController = exports.InventoryController = void 0;
const inventory_service_1 = require("./inventory.service");
/**
 * Inventory controller.
 * Handles HTTP request/response logic for inventory
 * (purchase/restock) endpoints.
 */
class InventoryController {
    /**
     * POST /api/vehicles/:id/purchase
     * Purchases a vehicle and creates a purchase history record.
     */
    async purchase(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: 'Unauthorized. User information not found.',
                });
                return;
            }
            const result = await inventory_service_1.inventoryService.purchaseVehicle(req.params.id, req.user.id);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/vehicles/:id/restock
     * Restocks a vehicle (Admin only), increasing its quantity.
     */
    async restock(req, res, next) {
        try {
            const { quantity } = req.body;
            const result = await inventory_service_1.inventoryService.restockVehicle(req.params.id, quantity);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.InventoryController = InventoryController;
exports.inventoryController = new InventoryController();
