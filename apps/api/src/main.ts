// Entry point: config, logger, HTTP server and graceful shutdown. No logic.

import { buildApp } from './bootstrap.ts';
import { loadConfig } from './config/config.ts';
import { consoleLogger } from './shared/logging/logger.ts';

const config = loadConfig();
const logger = consoleLogger;
const app = buildApp({ config, logger });

const server = app.listen(config.port, (err) => {
	if (err) {
		logger.error('Server failed to start', { error: err.message });
		process.exitCode = 1;
		return;
	}
	logger.info(`API listening on http://localhost:${String(config.port)}`);
});

function shutdown(signal: NodeJS.Signals): void {
	logger.info(`Received ${signal}, shutting down`);
	server.close((err) => {
		if (err) {
			logger.error('Error while closing the server', { error: err.message });
			process.exitCode = 1;
		}
	});
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
