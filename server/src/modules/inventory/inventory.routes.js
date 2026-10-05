"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventory_controller_1 = require("./inventory.controller");
const auth_1 = require("../../middleware/auth");
const adminOnly_1 = require("../../middleware/adminOnly");
const validate_1 = require("../../middleware/validate");
const inventory_schema_1 = require("./inventory.schema");
/**
 * Inventory routes — all endpoints require authentication.
 * POST /api/vehicles/:id/purchase - Purchase a vehicle (any authenticated user)
 * POST /api/vehicles/:id/restock  - Restock a vehicle (Admin only)
 */
const router = (0, express_1.Router)();
router.post('/:id/purchase', auth_1.authenticate, (req, res, next) => {
    inventory_controller_1.inventoryController.purchase(req, res, next);
});
router.post('/:id/restock', auth_1.authenticate, adminOnly_1.adminOnly, (0, validate_1.validate)(inventory_schema_1.restockSchema), (req, res, next) => {
    inventory_controller_1.inventoryController.restock(req, res, next);
});
exports.default = router;
