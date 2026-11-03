// Single entry point to the backend. In development Vite proxies `/api` to
// the Express API (see apps/web/vite.config.ts), so there is no CORS and no
// hardcoded host in the code.

const API_BASE_URL = '/api';

export class ApiError extends Error {
	readonly status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
	}
}

export async function getJson<TBody>(
	path: string,
	signal: AbortSignal
): Promise<TBody> {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		headers: { accept: 'application/json' },
		signal,
	});

	if (!response.ok) {
		throw new ApiError(
			response.status,
			`GET ${path} failed with status ${String(response.status)}`
		);
	}

	// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- The body shape is the contract published by apps/api.
	return (await response.json()) as TBody;
}
