import app from './app';
import env from './config/env';

/**
 * Server entry point.
 * Starts the Express HTTP server on the configured port.
 */
const PORT = parseInt(env.PORT, 10);

app.listen(PORT, () => {
  console.log(`🚗 Car Dealership API running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
});
