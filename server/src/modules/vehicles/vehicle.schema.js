"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchVehicleSchema = exports.updateVehicleSchema = exports.createVehicleSchema = void 0;
const zod_1 = require("zod");
/**
 * Validation schema for creating a new vehicle.
 */
exports.createVehicleSchema = zod_1.z.object({
    make: zod_1.z.string().min(1, 'Make is required').max(100),
    model: zod_1.z.string().min(1, 'Model is required').max(100),
    category: zod_1.z.string().min(1, 'Category is required').max(50),
    price: zod_1.z.number().positive('Price must be a positive number'),
    quantity: zod_1.z.number().int().min(0, 'Quantity cannot be negative').default(0),
    imageUrl: zod_1.z.string().url('Invalid image URL').optional().nullable(),
});
/**
 * Validation schema for updating a vehicle.
 * All fields are optional to allow partial updates.
 */
exports.updateVehicleSchema = zod_1.z.object({
    make: zod_1.z.string().min(1).max(100).optional(),
    model: zod_1.z.string().min(1).max(100).optional(),
    category: zod_1.z.string().min(1).max(50).optional(),
    price: zod_1.z.number().positive().optional(),
    quantity: zod_1.z.number().int().min(0).optional(),
    imageUrl: zod_1.z.string().url().optional().nullable(),
});
/**
 * Validation schema for vehicle search query parameters.
 */
exports.searchVehicleSchema = zod_1.z.object({
    make: zod_1.z.string().optional(),
    model: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    minPrice: zod_1.z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
    maxPrice: zod_1.z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
});
