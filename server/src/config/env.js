"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
// Load environment variables from .env file
dotenv_1.default.config();
/**
 * Schema for validating required environment variables.
 * Ensures the application won't start with missing configuration.
 */
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL is required'),
    JWT_SECRET: zod_1.z.string().min(8, 'JWT_SECRET must be at least 8 characters'),
    PORT: zod_1.z.string().default('5000'),
    ADMIN_SECRET: zod_1.z.string().min(1, 'ADMIN_SECRET is required'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
});
/**
 * Validated environment variables.
 * Will throw a descriptive error at startup if any required variable is missing.
 */
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsedEnv.data;
exports.default = exports.env;
