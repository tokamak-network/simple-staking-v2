import { AppProps } from 'next/app';


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
