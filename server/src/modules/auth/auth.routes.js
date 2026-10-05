"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validate_1 = require("../../middleware/validate");
const auth_schema_1 = require("./auth.schema");
/**
 * Authentication routes.
 * POST /api/auth/register - Register a new user
 * POST /api/auth/login    - Login and receive JWT token
 */
const router = (0, express_1.Router)();
router.post('/register', (0, validate_1.validate)(auth_schema_1.registerSchema), (req, res, next) => {
    auth_controller_1.authController.register(req, res, next);
});
router.post('/login', (0, validate_1.validate)(auth_schema_1.loginSchema), (req, res, next) => {
    auth_controller_1.authController.login(req, res, next);
});
exports.default = router;
