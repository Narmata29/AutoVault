"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationSchema = void 0;
const zod_1 = require("zod");
exports.recommendationSchema = zod_1.z.object({
    minPrice: zod_1.z.coerce.number().min(0).optional(),
    maxPrice: zod_1.z.coerce.number().min(0).optional(),
    category: zod_1.z.string().trim().min(1).optional(),
}).refine((data) => data.minPrice === undefined ||
    data.maxPrice === undefined ||
    data.minPrice <= data.maxPrice, {
    message: 'Minimum price cannot be greater than maximum price.',
    path: ['minPrice'],
});
