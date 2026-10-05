"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const errorHandler_1 = require("./middleware/errorHandler");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const vehicle_routes_1 = __importDefault(require("./modules/vehicles/vehicle.routes"));
const inventory_routes_1 = __importDefault(require("./modules/inventory/inventory.routes"));
const purchase_routes_1 = __importDefault(require("./modules/purchases/purchase.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const recommendation_routes_1 = __importDefault(require("./modules/recommendations/recommendation.routes"));
const invoice_routes_1 = __importDefault(require("./modules/invoices/invoice.routes"));
const wishlist_routes_1 = __importDefault(require("./modules/wishlist/wishlist.routes"));
/**
 * Express application setup.
 * Separated from server.ts to allow Supertest to import the app
 * without starting the HTTP server.
 */
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// Body parsing
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/vehicles', vehicle_routes_1.default);
app.use('/api/vehicles', inventory_routes_1.default);
app.use('/api/purchases', purchase_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/recommendations', recommendation_routes_1.default);
app.use('/api/invoices', invoice_routes_1.default);
app.use("/api/wishlist", wishlist_routes_1.default);
// Global error handler (must be last)
app.use(errorHandler_1.errorHandler);
exports.default = app;
