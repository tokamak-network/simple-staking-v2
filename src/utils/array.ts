export function range(n: number, m: number) {
	if (typeof n !== "number" || typeof m !== "number") {
		throw new TypeError("Both n and m must be numbers");
	}

	if (n === m) return [n];
	if (
		(n > m && m === n + 1) ||
		(m > n && n === m + 1) ||
		m === Number.NEGATIVE_INFINITY
	)
		return [];

	if (n <= m) {
		return Array.from({ length: m - n + 1 }, (_, i) => String(n + i));
	} else {
		return Array.from({ length: n - m + 1 }, (_, i) => String(n - i));
	}
}

export function findMax(arr: any) {
	if (!Array.isArray(arr)) {
		throw new TypeError("Input must be an array");
	}

	let max = Number.NEGATIVE_INFINITY;
	for (let i = 0; i < arr.length; i++) {
		const num = parseFloat(arr[i]);
		if (num > max) max = num;
	}
	return max;
}

export function arraysEqual(arr1: any, arr2: any) {
	if (arr1.length !== arr2.length) {
		return false;
	}
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	}
	return true;
}
