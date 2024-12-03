import { injected, trazorConnector } from "connectors/";
import { WalletInfo } from "@/types/wallet";
// import { DEPLOYED_TYPE } from "./type";
import { ethers } from "ethers";

export const REACT_APP_MODE = process.env.NEXT_PUBLIC_MODE as string;

export const NetworkContextName = `${new Date().getTime()}-NETWORK`;
export const DEFAULT_NETWORK: string | undefined =
// "1"
REACT_APP_MODE === "PRODUCTION" ? "1" : "11155111";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const MAINNET_API = process.env.NEXT_PUBLIC_API_PRODUCTION;
const DEV_API = process.env.NEXT_PUBLIC_API_DEV;
const GRAPHQL_MAINNET = process.env.NEXT_PUBLIC_GRAPHQL_API_PRODUCTION;
const GRAPHQL_DEV = process.env.NEXT_PUBLIC_GRAPHQL_API_DEV;
export const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
export const ETHERSCAN_API = REACT_APP_MODE === "PRODUCTION" ? "https://api.etherscan.io" : "https://api-sepolia.etherscan.io"

export const ETHERSCAN_LINK = REACT_APP_MODE === "PRODUCTION" ? "https://etherscan.io" : "https://sepolia.etherscan.io"
export const TITAN_EXPLORER_LINK = REACT_APP_MODE === "PRODUCTION" ? "https://explorer.titan.tokamak.network" : "https://explorer.titan-sepolia.tokamak.network"

export const TITAN_SUBGRAPH = REACT_APP_MODE === "PRODUCTION" ? process.env.NEXT_PUBLIC_TITAN_SUBGRAPH : process.env.NEXT_PUBLIC_TITAN_SEPOLIA_SUBGRAPH
export const THANOS_SUBGRAPH = REACT_APP_MODE === "PRODUCTION" ? process.env.NEXT_PUBLIC_THANOS_SUBGRAPH : process.env.NEXT_PUBLIC_THANOS_SEPOLIA_SUBGRAPH
export const TITAN_RPC = REACT_APP_MODE === "PRODUCTION" ? process.env.NEXT_PUBLIC_TITAN_RPC : process.env.NEXT_PUBLIC_TITAN_SEPOLIA_RPC

export const BASE_PROVIDER =
REACT_APP_MODE === "PRODUCTION"
    ? ethers.getDefaultProvider("mainnet")
    : ethers.getDefaultProvider("sepolia");

export const API = 
// MAINNET_API
REACT_APP_MODE === "PRODUCTION" ? MAINNET_API : DEV_API;

export const GRAPHQL_API = 
// GRAPHQL_MAINNET
  REACT_APP_MODE === "PRODUCTION" ? GRAPHQL_MAINNET : GRAPHQL_DEV;

export const NON_CANDIDATE = [
  {
    name: 'DXM Corp',
    layer2: '0x41fb4bad6fba9e9b6e45f3f96ba3ad7ec2ff5b3c'
  },
  {
    name: 'Danal Fintech',
    layer2: '0x97d0a5880542ab0e699c67e7f4ff61f2e5200484'
  },
  {
    name: 'Talken',
    layer2: '0xb9d336596ea2662488641c4ac87960bfdcb94c6e'
  },
  {
    name: 'staked',
    layer2: '0xcc38c7aaf2507da52a875e93f57451e58e8c6372'
  },
]

export const RAY = '1000000000000000000000000000'
export const WEI = '1000000000000000000'


export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: "Injected",
    iconName: "Metamask.jpg",
    description: "Injected web3 provider.",
    href: null,
    color: "#010101",
    primary: true,
    type: "INJECTED",
  },
  METAMASK: {
    connector: injected,
    name: "MetaMask",
    iconName: "Metamask.jpg",
    description: "Easy-to-use browser extension.",
    href: null,
    color: "#E8831D",
    type: "METAMASK",
  },
  TREZOR: {
    connector: trazorConnector,
    name: "Trezor",
    iconName: "Trezor.png",
    description: "Hardware Wallet.",
    href: null,
    color: "#E8831D",
    type: "TREZOR",
  },
};
