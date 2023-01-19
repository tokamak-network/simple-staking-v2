import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { convertNumber } from "utils/number";
import useCallContract from "hooks/useCallContract";
import { useBlockNumber } from "./useBlockNumber";

const useUserBalance = (account: string | null | undefined) => {
  const { library } = useWeb3React();
  const {
    TON_CONTRACT,
    WTON_CONTRACT,
  } = useCallContract();
  const { blockNumber } = useBlockNumber();

  const [userTonBalance, setUserTonBalance] = useState<string | undefined>(
    undefined
  );
  const [userWTonBalance, setUserWTonBalance] = useState<string | undefined>(
    undefined
  );
  
  const [userETHBalance, setUserETHBalance] = useState<string | undefined>(
    undefined
  );
  
  useEffect(() => {
    async function fetchBalance() {
      try {
        if (
          !TON_CONTRACT ||
          !WTON_CONTRACT
        ) {
          return;
        }
        const ton = await TON_CONTRACT.balanceOf(account);
        const wton = await WTON_CONTRACT.balanceOf(account);
        const eth = await library?.getBalance(account);
        
        const convertedTon = convertNumber({
          amount: ton.toString(),
          localeString: true,
        });
        const convertedWTon = convertNumber({
          type: "ray",
          amount: wton.toString(),
          localeString: true,
        });
        const convertedEth = convertNumber({
          amount: eth.toString(),
          localeString: true,
        });
    
        setUserTonBalance(convertedTon || "-");
        setUserWTonBalance(convertedWTon || "-");
        setUserETHBalance(convertedEth || "-");
    
      } catch (e) {
        console.log("*****fetch balance err*****");
        console.log(e);
      }
    }
    if (account) {
      fetchBalance();
    }
  }, [
    account,
    TON_CONTRACT,
    WTON_CONTRACT,
    library,
    blockNumber,
  ]);

  return {
    userTonBalance,
    userWTonBalance,
    userETHBalance,
  };
};

export default useUserBalance;
