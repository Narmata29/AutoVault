import { z } from 'zod';

export const recommendationSchema = z.object({
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  category: z.string().trim().min(1).optional(),
}).refine(
  (data) =>
    data.minPrice === undefined ||
    data.maxPrice === undefined ||
    data.minPrice <= data.maxPrice,
  {
    message: 'Minimum price cannot be greater than maximum price.',
    path: ['minPrice'],
  }
);

export type RecommendationInput = z.infer<typeof recommendationSchema>;