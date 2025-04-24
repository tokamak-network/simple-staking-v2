import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { TrezorConnector } from "@web3-react/trezor-connector";

// import {REACT_APP_MAINNET_INFURA_API, REACT_APP_RINKEBY_INFURA_API} from 'constants/index';

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
  1: "https://mainnet.infura.io/v3/34448178b25e4fbda6d80f4da62afba2",
  11155111: "https://sepolia.infura.io/v3/34448178b25e4fbda6d80f4da62afba2",
};

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[1], 11155111: RPC_URLS[11155111] },
  defaultChainId: 1,
});

const newWalletConnect = () =>
  new WalletConnectConnector({
    rpc: { 1: RPC_URLS[1] },
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
    //@ts-ignore
    pollingInterval: POLLING_INTERVAL,
  });

const newWalletLink = () =>
  new WalletLinkConnector({
    url: RPC_URLS[1],
    appName: "",
  });

export enum ImageFileType {
  JPEG = ".jpg",
  PNG = ".png",
  SVG = ".svg",
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 11155111, 5],
});

export enum SupportedChainId {
  MAINNET = 1,
  //   ARBITRUM_ONE = 42161,
  //   ARBITRUM_GOERLI = 421613,
  //   OPTIMISM = 10,
  //   OPTIMISM_GOERLI = 420,
  //   POLYGON = 137,
  //   POLYGON_MUMBAI = 80001,
  //   CELO = 42220,
  //   CELO_ALFAJORES = 44787,
  //   BNB = 56,
  TITAN = 55004,
  SEPOLIA = 11155111,
  THANOS_SEPOLIA = 111551119090,
  TITAN_SEPOLIA = 55007,
}

export interface SupportedChainProperties {
  chainId: SupportedChainId;
  chainName: keyof typeof SupportedChainId;
  rpcAddress: string;
  networkImage: ImageFileType;
  isTokamak?: boolean;
  layer: "L1" | "L2";
  isTOP?: boolean;
  isTestnet?: boolean;
}

export const trazorConnector = new TrezorConnector({
  chainId: 1,
  url: RPC_URLS[1],
  pollingInterval: POLLING_INTERVAL,
  manifestEmail: "ale.s@onther.io",
  manifestAppUrl: "http://localhost:3000",
});

// Fixes https://github.com/NoahZinsmeister/web3-react/issues/124
// You can close and open walletconnect at will with this fix
export let walletconnect = newWalletConnect();
export let walletlink = newWalletLink();

export const resetWalletConnect = () => {
  walletconnect = newWalletConnect();
};

export const resetWalletLink = () => {
  walletlink = newWalletLink();
};
