import type { Router } from 'express';

import type { AppConfig } from '../config/config.ts';
import type { Logger } from './logging/logger.ts';

// Toolbox every module receives in its factory (Go: shared.App)
export interface AppContext {
	readonly config: AppConfig;
	readonly logger: Logger;
}

// The only contract a module exposes to the composition root
export interface AppModule {
	readonly basePath: string;
	readonly router: Router;
}
