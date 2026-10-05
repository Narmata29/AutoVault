"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehicle_controller_1 = require("./vehicle.controller");
const auth_1 = require("../../middleware/auth");
const adminOnly_1 = require("../../middleware/adminOnly");
const validate_1 = require("../../middleware/validate");
const vehicle_schema_1 = require("./vehicle.schema");
/**
 * Vehicle routes — all endpoints require authentication.
 * POST   /api/vehicles        - Add a new vehicle
 * GET    /api/vehicles        - List all vehicles
 * GET    /api/vehicles/search - Search vehicles
 * PUT    /api/vehicles/:id    - Update a vehicle
 * DELETE /api/vehicles/:id    - Delete a vehicle (Admin only)
 */
const router = (0, express_1.Router)();
// Search must be defined before :id to avoid treating "search" as an ID
router.get("/search", auth_1.authenticate, (0, validate_1.validate)(vehicle_schema_1.searchVehicleSchema, "query"), (req, res, next) => {
    vehicle_controller_1.vehicleController.search(req, res, next);
});
router.get("/", auth_1.authenticate, (req, res, next) => {
    vehicle_controller_1.vehicleController.getAllVehicles(req, res, next);
});
router.post("/", auth_1.authenticate, adminOnly_1.adminOnly, (0, validate_1.validate)(vehicle_schema_1.createVehicleSchema), (req, res, next) => {
    vehicle_controller_1.vehicleController.create(req, res, next);
});
router.put("/:id", auth_1.authenticate, adminOnly_1.adminOnly, (0, validate_1.validate)(vehicle_schema_1.updateVehicleSchema), (req, res, next) => {
    vehicle_controller_1.vehicleController.update(req, res, next);
});
router.delete("/:id", auth_1.authenticate, adminOnly_1.adminOnly, (req, res, next) => {
    vehicle_controller_1.vehicleController.delete(req, res, next);
});
exports.default = router;
