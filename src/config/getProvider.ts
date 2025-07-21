import { SupportedChainId, SupportedChainProperties } from "@/connectors";
import { ethers } from "ethers";

const EthereumProvider = new ethers.providers.JsonRpcProvider(
	process.env.NEXT_PUBLIC_ETHEREUM_RPC,
);
const SepoliaProvider = new ethers.providers.JsonRpcProvider(
	process.env.NEXT_PUBLIC_SEPOLIA_RPC,
);

const providers: {
	[K in keyof typeof SupportedChainId]: ethers.providers.JsonRpcProvider;
} = {
	MAINNET: EthereumProvider,
	SEPOLIA: SepoliaProvider,
};

export function getProvider(inNetwork: SupportedChainProperties | null) {
	if (inNetwork === null) {
		return;
	}
	return providers[inNetwork.chainName];
}

export const providerByChainId: Record<
	number,
	ethers.providers.JsonRpcProvider
> = {
	[SupportedChainId.MAINNET]: EthereumProvider,
	[SupportedChainId.SEPOLIA]: SepoliaProvider,
};
