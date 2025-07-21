import { useTONPrice } from "@/hooks/staking/useTONPrice";
import { Flex } from "@chakra-ui/react";

type UnstakableBalanceProps = {
	stakedAmount: string | undefined;
	justify: string;
	tokenType?: string;
};

export const UnstakableBalance = (args: UnstakableBalanceProps) => {
	const { stakedAmount, justify, tokenType } = args;
	const { tonPriceUSD } = useTONPrice();
	const dollor = stakedAmount
		? parseFloat(stakedAmount.replaceAll(",", "")) * tonPriceUSD
		: "0.00";

	return (
		<Flex
			flexDir={"row"}
			fontSize={"12px"}
			fontWeight={"normal"}
			color={"#7e7e8f"}
			mt={"8px"}
			justifyContent={justify}
			mr={"20px"}
		>
			<Flex>
				Balance: {stakedAmount} {tokenType ? tokenType : "TON"}
			</Flex>
			<Flex mx={"3px"}>/</Flex>
			<Flex>
				{`$ ${dollor.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
			</Flex>
		</Flex>
	);
};
