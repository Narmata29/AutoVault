"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = exports.AdminController = void 0;
const admin_service_1 = require("./admin.service");
class AdminController {
    /**
     * GET /api/admin/analytics
     * Returns dealership analytics for admin users.
     */
    async getAnalytics(_req, res, next) {
        try {
            const analytics = await admin_service_1.adminService.getAnalytics();
            res.status(200).json({
                analytics,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getDemandInsights(_req, res, next) {
        try {
            const insights = await admin_service_1.adminService.getDemandInsights();
            res.status(200).json({
                insights,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminController = AdminController;
exports.adminController = new AdminController();
