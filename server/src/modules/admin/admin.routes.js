"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const auth_1 = require("../../middleware/auth");
const adminOnly_1 = require("../../middleware/adminOnly");
const router = (0, express_1.Router)();
/**
 * GET /api/admin/analytics
 * Admin-only dealership analytics.
 */
router.get('/analytics', auth_1.authenticate, adminOnly_1.adminOnly, (req, res, next) => {
    admin_controller_1.adminController.getAnalytics(req, res, next);
});
router.get('/demand-insights', auth_1.authenticate, adminOnly_1.adminOnly, (req, res, next) => {
    admin_controller_1.adminController.getDemandInsights(req, res, next);
});
exports.default = router;
