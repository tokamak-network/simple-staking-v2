import { Box, Flex, Text, useTheme, Button } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import AccountCard from "./AccountCard";
import useUserBalance from "@/hooks/useUserBalance";

function AccountTab() {
  const { account } = useWeb3React();

  const { userETHBalance, userTonBalance, userWTonBalance } = useUserBalance(account);

  return (
    <Flex w="100%" flexDir={"column"} px='20px'>
      <AccountCard title={"ETH Balance"} amount={userETHBalance ? userETHBalance : '0'} symbol={"ETH"} />
      <AccountCard title={"TON Balance"} amount={userTonBalance ? userTonBalance : '0'} symbol={"TON"} />
      <AccountCard title={"WTON Balance"} amount={userWTonBalance ? userWTonBalance : '0'} symbol={"TON"} />
    </Flex>
  );
}

export default AccountTab;
