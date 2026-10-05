"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
/**
 * Generic Zod validation middleware factory.
 * Validates the specified request property (body, query, params)
 * against the provided Zod schema.
 *
 * @param schema - Zod schema to validate against
 * @param source - Which part of the request to validate (defaults to 'body')
 */
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        try {
            const parsed = schema.parse(req[source]);
            req[source] = parsed;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formattedErrors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                res.status(400).json({
                    error: 'Validation failed',
                    details: formattedErrors,
                });
                return;
            }
            next(error);
        }
    };
};
exports.validate = validate;
