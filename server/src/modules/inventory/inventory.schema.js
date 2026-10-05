"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restockSchema = void 0;
const zod_1 = require("zod");
/**
 * Validation schema for restocking a vehicle.
 */
exports.restockSchema = zod_1.z.object({
    quantity: zod_1.z
        .number()
        .int('Quantity must be a whole number')
        .positive('Quantity must be a positive number'),
});
