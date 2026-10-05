"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleService = exports.VehicleService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const errorHandler_1 = require("../../middleware/errorHandler");
/**
 * Vehicle service.
 * Handles all vehicle-related business logic including CRUD and search operations.
 */
class VehicleService {
    /**
     * Creates a new vehicle in the inventory.
     */
    async createVehicle(data) {
        const vehicle = await prisma_1.default.vehicle.create({
            data,
        });
        return vehicle;
    }
    /**
     * Retrieves all vehicles from the inventory.
     */
    async getAllVehicles(page = 1, limit = 5, sortBy = "createdAt", order = "desc") {
        const skip = (page - 1) * limit;
        let orderBy;
        switch (sortBy) {
            case "price":
                orderBy = { price: order };
                break;
            case "quantity":
                orderBy = { quantity: order };
                break;
            case "make":
                orderBy = { make: order };
                break;
            case "createdAt":
            default:
                orderBy = { createdAt: order };
                break;
        }
        const [vehicles, totalVehicles] = await Promise.all([
            prisma_1.default.vehicle.findMany({
                skip,
                take: limit,
                orderBy,
            }),
            prisma_1.default.vehicle.count(),
        ]);
        return {
            vehicles,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalVehicles / limit),
                totalVehicles,
                limit,
            },
        };
    }
    /**
     * Retrieves a single vehicle by its ID.
     * @throws AppError if vehicle is not found.
     */
    async getVehicleById(id) {
        const vehicle = await prisma_1.default.vehicle.findUnique({
            where: { id },
        });
        if (!vehicle) {
            throw new errorHandler_1.AppError("Vehicle not found.", 404);
        }
        return vehicle;
    }
    /**
     * Searches vehicles by make, model, category, and/or price range.
     * All search criteria are optional and combined with AND logic.
     */
    async searchVehicles(query) {
        const where = {};
        if (query.make) {
            where.make = { contains: query.make, mode: "insensitive" };
        }
        if (query.model) {
            where.model = { contains: query.model, mode: "insensitive" };
        }
        if (query.category) {
            where.category = { contains: query.category, mode: "insensitive" };
        }
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            where.price = {};
            if (query.minPrice !== undefined) {
                where.price.gte = query.minPrice;
            }
            if (query.maxPrice !== undefined) {
                where.price.lte = query.maxPrice;
            }
        }
        const vehicles = await prisma_1.default.vehicle.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
        return vehicles;
    }
    /**
     * Updates a vehicle's details.
     * @throws AppError if vehicle is not found.
     */
    async updateVehicle(id, data) {
        // Verify vehicle exists
        await this.getVehicleById(id);
        const vehicle = await prisma_1.default.vehicle.update({
            where: { id },
            data,
        });
        return vehicle;
    }
    /**
     * Deletes a vehicle from the inventory.
     * @throws AppError if vehicle is not found.
     */
    async deleteVehicle(id) {
        // Verify vehicle exists
        await this.getVehicleById(id);
        await prisma_1.default.vehicle.delete({
            where: { id },
        });
        return { message: "Vehicle deleted successfully." };
    }
}
exports.VehicleService = VehicleService;
exports.vehicleService = new VehicleService();
