"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseController = exports.PurchaseController = void 0;
const purchase_service_1 = require("./purchase.service");
class PurchaseController {
    /**
     * GET /api/purchases
     * Returns purchase history of the authenticated user.
     */
    async getMyPurchases(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: 'Unauthorized. User information not found.',
                });
                return;
            }
            const purchases = await purchase_service_1.purchaseService.getMyPurchases(req.user.id);
            res.status(200).json({
                purchases,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PurchaseController = PurchaseController;
exports.purchaseController = new PurchaseController();
