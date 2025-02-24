import {
  SupportedChainId,
  SupportedChainProperties,
} from "@/connectors";
import { ethers } from "ethers";

const EthereumProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_ETHEREUM_RPC
);
const TitanProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_TITAN_RPC
);
const SepoliaProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_SEPOLIA_RPC
);
const ThanosSepoliaProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_THANOS_SEPOLIA_RPC
);
const TitanSepoliaProvier = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_TITAN_SEPOLIA_RPC
);

const providers: {
  [K in keyof typeof SupportedChainId]: ethers.providers.JsonRpcProvider;
} = {
  MAINNET: EthereumProvider,
  TITAN: TitanProvider,
  SEPOLIA: SepoliaProvider,
  THANOS_SEPOLIA: ThanosSepoliaProvider,
  TITAN_SEPOLIA: TitanSepoliaProvier,
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
  [SupportedChainId.TITAN]: TitanProvider,
  [SupportedChainId.SEPOLIA]: SepoliaProvider,
  [SupportedChainId.THANOS_SEPOLIA]: ThanosSepoliaProvider,
  [SupportedChainId.TITAN_SEPOLIA]: TitanSepoliaProvier,
};
