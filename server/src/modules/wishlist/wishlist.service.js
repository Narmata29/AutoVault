"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistService = exports.WishlistService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
class WishlistService {
    async addToWishlist(userId, vehicleId) {
        const vehicle = await prisma_1.default.vehicle.findUnique({
            where: {
                id: vehicleId,
            },
        });
        if (!vehicle) {
            throw new Error("Vehicle not found");
        }
        const existingWishlist = await prisma_1.default.wishlist.findUnique({
            where: {
                userId_vehicleId: {
                    userId,
                    vehicleId,
                },
            },
        });
        if (existingWishlist) {
            throw new Error("Vehicle already in wishlist");
        }
        return prisma_1.default.wishlist.create({
            data: {
                userId,
                vehicleId,
            },
            include: {
                vehicle: true,
            },
        });
    }
    async removeFromWishlist(userId, vehicleId) {
        const wishlist = await prisma_1.default.wishlist.findUnique({
            where: {
                userId_vehicleId: {
                    userId,
                    vehicleId,
                },
            },
        });
        if (!wishlist) {
            throw new Error("Vehicle not found in wishlist");
        }
        await prisma_1.default.wishlist.delete({
            where: {
                userId_vehicleId: {
                    userId,
                    vehicleId,
                },
            },
        });
        return {
            message: "Vehicle removed from wishlist",
        };
    }
    async getWishlist(userId) {
        return prisma_1.default.wishlist.findMany({
            where: {
                userId,
            },
            include: {
                vehicle: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}
exports.WishlistService = WishlistService;
exports.wishlistService = new WishlistService();
