"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
/**
 * Admin-only authorization middleware.
 * Must be used AFTER the authenticate middleware.
 * Returns 403 if the authenticated user is not an admin.
 */
const adminOnly = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
    }
    if (req.user.role !== 'ADMIN') {
        res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        return;
    }
    next();
};
exports.adminOnly = adminOnly;
