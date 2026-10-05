"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const purchase_controller_1 = require("./purchase.controller");
const router = (0, express_1.Router)();
/**
 * GET /api/purchases
 * Get purchase history of the logged-in user.
 */
router.get('/', auth_1.authenticate, (req, res, next) => {
    purchase_controller_1.purchaseController.getMyPurchases(req, res, next);
});
exports.default = router;
