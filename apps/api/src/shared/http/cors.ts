import type { RequestHandler } from 'express';

import cors from 'cors';

// Disallowed origins simply get no CORS headers, so the browser blocks them
// while non-browser clients (curl, server-to-server) keep working.
export function corsMiddleware(
	allowedOrigins: readonly string[]
): RequestHandler {
	return cors({ origin: [...allowedOrigins] });
}
