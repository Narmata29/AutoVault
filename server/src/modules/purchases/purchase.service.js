"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseService = exports.PurchaseService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
class PurchaseService {
    async getMyPurchases(userId) {
        const purchases = await prisma_1.default.purchase.findMany({
            where: {
                userId,
            },
            include: {
                vehicle: {
                    select: {
                        id: true,
                        make: true,
                        model: true,
                        category: true,
                        imageUrl: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return purchases;
    }
}
exports.PurchaseService = PurchaseService;
exports.purchaseService = new PurchaseService();
