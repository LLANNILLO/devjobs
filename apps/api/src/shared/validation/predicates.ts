export function includesValue(
	allowed: readonly string[],
	value: string
): boolean {
	return allowed.includes(value);
}

export function isOneOf<TValue extends string>(
	allowed: readonly TValue[],
	value: string
): value is TValue {
	return includesValue(allowed, value);
}

export function isNonBlank(value: string | undefined): value is string {
	return value !== undefined && value.trim() !== '';
}

export function hasUniqueValuesFrom(
	allowed: readonly string[],
	values: readonly string[]
): boolean {
	return (
		values.length > 0 &&
		new Set(values).size === values.length &&
		values.every((value) => includesValue(allowed, value))
	);
}
