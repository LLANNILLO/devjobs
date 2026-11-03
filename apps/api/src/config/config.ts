// The only place allowed to read process.env (see tooling/lint/express.ts)

const DEFAULT_PORT = 1234;
const MAX_PORT = 65_535;
const DEFAULT_CORS_ORIGINS: readonly string[] = ['http://localhost:5173'];

export interface AppConfig {
	readonly corsOrigins: readonly string[];
	readonly port: number;
}

function parsePort(value: string | undefined): number {
	if (value === undefined || value.trim() === '') {
		return DEFAULT_PORT;
	}

	const port = Number(value);
	if (!Number.isInteger(port) || port < 0 || port > MAX_PORT) {
		throw new RangeError(`Invalid PORT "${value}"`);
	}

	return port;
}

function parseOrigins(value: string | undefined): readonly string[] {
	if (value === undefined || value.trim() === '') {
		return DEFAULT_CORS_ORIGINS;
	}

	return value
		.split(',')
		.map((origin) => origin.trim())
		.filter((origin) => origin !== '');
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
	return {
		corsOrigins: parseOrigins(env.CORS_ORIGINS),
		port: parsePort(env.PORT),
	};
}
