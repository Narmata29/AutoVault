"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
/**
 * Authentication controller.
 * Handles HTTP request/response logic for auth endpoints.
 */
class AuthController {
    /**
     * POST /api/auth/register
     * Registers a new user and returns user data with JWT token.
     */
    async register(req, res, next) {
        try {
            const data = req.body;
            const result = await auth_service_1.authService.register(data);
            res.status(201).json({
                message: 'User registered successfully.',
                ...result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/auth/login
     * Authenticates a user and returns user data with JWT token.
     */
    async login(req, res, next) {
        try {
            const data = req.body;
            const result = await auth_service_1.authService.login(data);
            res.status(200).json({
                message: 'Login successful.',
                ...result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
