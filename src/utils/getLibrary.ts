import { Web3Provider } from "@ethersproject/providers";

const getLibrary = (provider: any): Web3Provider => {
	const library = new Web3Provider(provider, "any");
	library.pollingInterval = 15000;
	return library;
};

export default getLibrary;
