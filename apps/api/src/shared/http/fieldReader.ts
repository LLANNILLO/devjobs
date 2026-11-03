// Decodes untrusted input (JSON body, query string) into plain values without
// unsafe casts. Type mismatches are collected as validation failures instead
// of being silently dropped. `TShape` (usually a contract DTO) restricts the
// keys that can be read, so a typo in a wire field name does not compile.

import type { ValidationFailure } from '../validation/validationError.ts';

import { ValidationError } from '../validation/validationError.ts';

function isRecord(value: unknown): value is object {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringList(value: unknown): value is string[] {
	return (
		Array.isArray(value) &&
		value.every((item: unknown) => typeof item === 'string')
	);
}

type FieldKey<TShape> = Extract<keyof TShape, string>;

export class FieldReader<TShape> {
	readonly #failures: ValidationFailure[];
	readonly #path: string;
	readonly #source: unknown;

	private constructor(
		source: unknown,
		path: string,
		failures: ValidationFailure[]
	) {
		this.#source = source;
		this.#path = path;
		this.#failures = failures;
	}

	static object<TShape>(source: unknown, name: string): FieldReader<TShape> {
		const reader = new FieldReader<TShape>(source, '', []);
		if (!isRecord(source)) {
			reader.#failures.push({ field: name, message: 'must be a JSON object' });
		}
		return reader;
	}

	nested<TKey extends FieldKey<TShape>>(
		key: TKey
	): FieldReader<NonNullable<TShape[TKey]>> {
		const value = this.#read(key);
		const isValid = value === undefined || isRecord(value);
		if (!isValid) {
			this.#fail(key, 'must be an object');
		}
		return new FieldReader<NonNullable<TShape[TKey]>>(
			isValid ? value : undefined,
			this.#field(key),
			this.#failures
		);
	}

	string(key: FieldKey<TShape>): string | undefined {
		const value = this.#read(key);
		if (value === undefined || typeof value === 'string') {
			return value;
		}
		this.#fail(key, 'must be a string');
		return undefined;
	}

	stringList(key: FieldKey<TShape>): string[] | undefined {
		const value = this.#read(key);
		if (value === undefined || isStringList(value)) {
			return value;
		}
		this.#fail(key, 'must be a list of strings');
		return undefined;
	}

	throwIfInvalid(): void {
		if (this.#failures.length > 0) {
			throw new ValidationError([...this.#failures]);
		}
	}

	#fail(key: string, message: string): void {
		this.#failures.push({ field: this.#field(key), message });
	}

	#field(key: string): string {
		return this.#path === '' ? key : `${this.#path}.${key}`;
	}

	#read(key: string): unknown {
		if (!isRecord(this.#source) || !Object.hasOwn(this.#source, key)) {
			return undefined;
		}
		const value: unknown = Reflect.get(this.#source, key);
		return value;
	}
}
