import { useWeb3React } from "@web3-react/core";
// import useClient from "hooks/useClient";
import { AppProps } from "next/app";
// import { useEffect } from "react";

function Entry({ Component, pageProps }: AppProps) {
  // const { isConnectedToChain, networkName } = useClient();

  // useEffect(() => {
  //   if (isConnectedToChain === false) {
  //     alert(`You have to connect to ${networkName}`);
  //   }
  // }, [isConnectedToChain, networkName]);

  if (Component) return <Component {...pageProps} />;
  return null;
}

export default Entry;
