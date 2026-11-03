import type { ValidationFailure } from './validationError.ts';

import {
	hasUniqueValuesFrom,
	includesValue,
	isNonBlank,
} from './predicates.ts';
import { ValidationError } from './validationError.ts';

export interface IntegerRange {
	readonly max: number;
	readonly min: number;
}

// Fluent builder that collects every failure before throwing, so clients get
// the full list of problems in a single response.
export class Validator {
	readonly #failures: ValidationFailure[] = [];

	check(isValid: boolean, failure: ValidationFailure): this {
		if (!isValid) {
			this.#failures.push(failure);
		}
		return this;
	}

	integerInRange(
		field: string,
		value: number | undefined,
		range: IntegerRange
	): this {
		const isValid =
			value === undefined ||
			(Number.isInteger(value) && value >= range.min && value <= range.max);
		return this.check(isValid, {
			field,
			message: `must be an integer between ${String(range.min)} and ${String(range.max)}`,
		});
	}

	oneOf(
		field: string,
		value: string | undefined,
		allowed: readonly string[]
	): this {
		return this.check(value === undefined || includesValue(allowed, value), {
			field,
			message: `must be one of: ${allowed.join(', ')}`,
		});
	}

	required(field: string, value: string | undefined): this {
		return this.check(isNonBlank(value), {
			field,
			message: 'must be a non-empty string',
		});
	}

	throwIfInvalid(): void {
		if (this.#failures.length > 0) {
			throw new ValidationError([...this.#failures]);
		}
	}

	uniqueListOf(
		field: string,
		values: readonly string[] | undefined,
		allowed: readonly string[]
	): this {
		return this.check(
			values === undefined || hasUniqueValuesFrom(allowed, values),
			{
				field,
				message: `must be a non-empty list of unique values from: ${allowed.join(', ')}`,
			}
		);
	}
}
