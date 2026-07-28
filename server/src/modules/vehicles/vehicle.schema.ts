import { z } from 'zod';

/**
 * Validation schema for creating a new vehicle.
 */
export const createVehicleSchema = z.object({
  make: z.string().min(1, 'Make is required').max(100),
  model: z.string().min(1, 'Model is required').max(100),
  category: z.string().min(1, 'Category is required').max(50),
  price: z.number().positive('Price must be a positive number'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative').default(0),
  imageUrl: z.string().url('Invalid image URL').optional().nullable(),
});

/**
 * Validation schema for updating a vehicle.
 * All fields are optional to allow partial updates.
 */
export const updateVehicleSchema = z.object({
  make: z.string().min(1).max(100).optional(),
  model: z.string().min(1).max(100).optional(),
  category: z.string().min(1).max(50).optional(),
  price: z.number().positive().optional(),
  quantity: z.number().int().min(0).optional(),
  imageUrl: z.string().url().optional().nullable(),
});

/**
 * Validation schema for vehicle search query parameters.
 */
export const searchVehicleSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type SearchVehicleInput = z.infer<typeof searchVehicleSchema>;
