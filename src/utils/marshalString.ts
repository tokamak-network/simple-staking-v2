export function marshalString(str: any) {
	if (str.slice(0, 2) === "0x") return str;
	return "0x".concat(str);
}

export function unmarshalString(str: string) {
	if (str.slice(0, 2) === "0x") return str.slice(2);
	return str;
}
