export type LogMeta = Readonly<Record<string, unknown>>;

export interface Logger {
	readonly error: (message: string, meta?: LogMeta) => void;
	readonly info: (message: string, meta?: LogMeta) => void;
}

export const consoleLogger: Logger = {
	error: (message, meta = {}) => {
		console.error(message, meta);
	},
	info: (message, meta = {}) => {
		console.info(message, meta);
	},
};

export const silentLogger: Logger = {
	error: () => {
		// Intentionally silent: used by tests
	},
	info: () => {
		// Intentionally silent: used by tests
	},
};

// Equivalent of a MediatR pipeline behavior: logs start and end of a use case
export async function logUseCase<TResult>(
	logger: Logger,
	useCase: string,
	run: () => Promise<TResult>
): Promise<TResult> {
	logger.info(`Processing ${useCase}`);
	try {
		const result = await run();
		logger.info(`Completed ${useCase}`);
		return result;
	} catch (err) {
		logger.info(`Completed ${useCase} with error`, { error: String(err) });
		throw err;
	}
}
