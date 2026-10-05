"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
/**
 * Validation schema for user registration.
 * Enforces strong password requirements and valid email format.
 */
exports.registerSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email('Invalid email format')
        .min(1, 'Email is required'),
    password: zod_1.z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must not exceed 100 characters'),
    name: zod_1.z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Name must not exceed 100 characters'),
    adminSecret: zod_1.z
        .string()
        .optional(),
});
/**
 * Validation schema for user login.
 */
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email('Invalid email format')
        .min(1, 'Email is required'),
    password: zod_1.z
        .string()
        .min(1, 'Password is required'),
});
