import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import vehicleRoutes from './modules/vehicles/vehicle.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import purchaseRoutes from './modules/purchases/purchase.routes';
import adminRoutes from './modules/admin/admin.routes';
import recommendationRoutes from './modules/recommendations/recommendation.routes';
import invoiceRoutes from './modules/invoices/invoice.routes';
import wishlistRoutes from "./modules/wishlist/wishlist.routes";

/**
 * Express application setup.
 * Separated from server.ts to allow Supertest to import the app
 * without starting the HTTP server.
 */
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/vehicles', inventoryRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
