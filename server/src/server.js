"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = __importDefault(require("./config/env"));
/**
 * Server entry point.
 * Starts the Express HTTP server on the configured port.
 */
const PORT = parseInt(env_1.default.PORT, 10);
app_1.default.listen(PORT, () => {
    console.log(`🚗 Car Dealership API running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${env_1.default.NODE_ENV}`);
});
