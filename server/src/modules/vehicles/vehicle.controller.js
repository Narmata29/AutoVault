"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleController = exports.VehicleController = void 0;
const vehicle_service_1 = require("./vehicle.service");
/**
 * Vehicle controller.
 * Handles HTTP request/response logic for vehicle endpoints.
 */
class VehicleController {
    /**
     * POST /api/vehicles
     * Creates a new vehicle in the inventory.
     */
    async create(req, res, next) {
        try {
            const vehicle = await vehicle_service_1.vehicleService.createVehicle(req.body);
            res.status(201).json({
                message: "Vehicle created successfully.",
                vehicle,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/vehicles
     * Returns all vehicles in the inventory.
     */
    async getAllVehicles(req, res, next) {
        try {
            const page = Math.max(parseInt(req.query.page) || 1, 1);
            const limit = Math.min(Math.max(parseInt(req.query.limit) || 5, 1), 50);
            const allowedSortFields = [
                "createdAt",
                "price",
                "quantity",
                "make",
            ];
            const requestedSort = req.query.sortBy;
            const sortBy = allowedSortFields.includes(requestedSort)
                ? requestedSort
                : "createdAt";
            const requestedOrder = req.query.order;
            const order = requestedOrder === "asc" || requestedOrder === "desc"
                ? requestedOrder
                : "desc";
            const result = await vehicle_service_1.vehicleService.getAllVehicles(page, limit, sortBy, order);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/vehicles/search
     * Searches vehicles by query parameters.
     */
    async search(req, res, next) {
        try {
            const vehicles = await vehicle_service_1.vehicleService.searchVehicles(req.query);
            res.status(200).json({ vehicles });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/vehicles/:id
     * Updates a vehicle's details.
     */
    async update(req, res, next) {
        try {
            const vehicle = await vehicle_service_1.vehicleService.updateVehicle(req.params.id, req.body);
            res.status(200).json({
                message: "Vehicle updated successfully.",
                vehicle,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/vehicles/:id
     * Deletes a vehicle (Admin only).
     */
    async delete(req, res, next) {
        try {
            const result = await vehicle_service_1.vehicleService.deleteVehicle(req.params.id);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.VehicleController = VehicleController;
exports.vehicleController = new VehicleController();
