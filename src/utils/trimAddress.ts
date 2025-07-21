function trimAddress(args: {
	address: string;
	firstChar: number;
	lastChar: number;
	dots: string;
}): string {
	const { address, firstChar, lastChar, dots } = args;
	const firstChatAt = address.substring(0, firstChar);
	const lastCharAt = address.substring(address.length - lastChar);
	return `${firstChatAt}${dots}${lastCharAt}`;
}

export default trimAddress;
