import { ethers } from "ethers";
const optimismSDK = require("@eth-optimism/sdk");

const endpoint = process.env.NEXT_PUBLIC_THANOS_SEPOLIA_RPC;
const l2Provider = new ethers.providers.JsonRpcProvider(endpoint);
// const l2Provider = new ethers.providers.JsonRpcProvider(
//   process.env.NEXT_PUBLIC_TITAN_RPC
// );
const l2RpcProvider = optimismSDK.asL2Provider(l2Provider);

function getL2Provider() {
  return l2Provider;
}

export { l2RpcProvider, l2Provider, getL2Provider };
