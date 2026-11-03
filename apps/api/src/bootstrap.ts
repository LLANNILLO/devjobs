// Builds the whole application. Used by main.ts and by the integration tests,
// so tests run exactly the same wiring as production.

import type { Express } from 'express';

import express from 'express';

import type { AppContext, AppModule } from './shared/module.ts';

import { createJobsModule } from './modules/jobs/module.ts';
import { corsMiddleware } from './shared/http/cors.ts';
import { createErrorHandler } from './shared/http/errorHandler.ts';
import { notFoundHandler } from './shared/http/notFound.ts';

export function buildApp(context: AppContext): Express {
	const app = express();
	app.disable('x-powered-by');
	app.use(corsMiddleware(context.config.corsOrigins));
	app.use(express.json());

	const modules: readonly AppModule[] = [createJobsModule(context)];
	for (const appModule of modules) {
		app.use(appModule.basePath, appModule.router);
	}

	app.use(notFoundHandler);
	app.use(createErrorHandler(context.logger));
	return app;
}
