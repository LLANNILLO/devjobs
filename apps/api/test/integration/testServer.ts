import { once } from 'node:events';

import { buildApp } from '../../src/bootstrap.ts';
import { silentLogger } from '../../src/shared/logging/logger.ts';

export interface TestServer {
	readonly close: () => Promise<void>;
	readonly request: (path: string, init?: RequestInit) => Promise<Response>;
}

// Boots the real application wiring on a random port
export async function startTestServer(): Promise<TestServer> {
	const app = buildApp({
		config: { corsOrigins: ['http://localhost:5173'], port: 0 },
		logger: silentLogger,
	});
	const server = app.listen(0);
	await once(server, 'listening');
	const address = server.address();
	if (address === null || typeof address === 'string') {
		throw new TypeError('The test server is not listening on a TCP port');
	}
	const { port } = address;

	return {
		close: async () => {
			server.close();
			await once(server, 'close');
		},
		request: async (path, init) =>
			fetch(`http://localhost:${String(port)}${path}`, init),
	};
}

export function jsonBody(method: string, body: unknown): RequestInit {
	return {
		body: JSON.stringify(body),
		headers: { 'content-type': 'application/json' },
		method,
	};
}

// Tests trust the response shape: the assertions themselves verify the contract
export async function readJson<TBody>(response: Response): Promise<TBody> {
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- The test assertions verify the shape of the body.
	return (await response.json()) as TBody;
}
