"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const env_1 = __importDefault(require("../../config/env"));
const errorHandler_1 = require("../../middleware/errorHandler");
const client_1 = require("@prisma/client");
/**
 * Authentication service.
 * Handles user registration and login business logic.
 */
class AuthService {
    /**
     * Registers a new user.
     * Hashes the password, optionally grants admin role if valid admin secret is provided.
     * @returns The created user (without password) and a JWT token.
     * @throws AppError if email already exists.
     */
    async register(data) {
        // Check if user already exists
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new errorHandler_1.AppError('A user with this email already exists.', 409);
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        // Determine role based on admin secret
        const role = data.adminSecret === env_1.default.ADMIN_SECRET ? client_1.Role.ADMIN : client_1.Role.USER;
        // Create user
        const user = await prisma_1.default.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                role,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
        // Generate token
        const token = this.generateToken(user.id, user.email, user.role);
        return { user, token };
    }
    /**
     * Authenticates a user with email and password.
     * @returns The user (without password) and a JWT token.
     * @throws AppError if credentials are invalid.
     */
    async login(data) {
        // Find user by email
        const user = await prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new errorHandler_1.AppError('Invalid email or password.', 401);
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new errorHandler_1.AppError('Invalid email or password.', 401);
        }
        // Generate token
        const token = this.generateToken(user.id, user.email, user.role);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: user.createdAt,
            },
            token,
        };
    }
    /**
     * Generates a JWT token with user claims.
     */
    generateToken(id, email, role) {
        return jsonwebtoken_1.default.sign({ id, email, role }, env_1.default.JWT_SECRET, { expiresIn: '24h' });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
