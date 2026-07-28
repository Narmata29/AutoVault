import { z } from 'zod';

/**
 * Validation schema for restocking a vehicle.
 */
export const restockSchema = z.object({
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .positive('Quantity must be a positive number'),
});

export type RestockInput = z.infer<typeof restockSchema>;
