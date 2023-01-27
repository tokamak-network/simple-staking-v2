import { Box, Flex, Text, useTheme, Button } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import trimAddress from "@/utils/trimAddress";
import { useState, useMemo } from "react";
import AccountTab from "./components/account/AccountTab";
// import HistoryTab from "./components/account/HistoryTab";
import { useUserHistory } from "../hooks/wallet/useUserHIstory";

function Account() {
  const theme = useTheme();
  const { account } = useWeb3React();
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const { userHistory } = useUserHistory();
  const [selectedTab, setSelectedTab] = useState("account");

  const historyColumns = useMemo(
    () => [
      {
        Header: "Transaction Hash",
        accessor: "txHash",
      },

      {
        Header: "Type",
        accessor: "txType",
      },
      {
        Header: "Amount",
        accessor: "amount",
      },

      {
        Header: "Status",
        accessor: "status",
      },
    ],
    []
  );
  return (
    <Flex
      w="100%"
      height={"100%"}
      pt="30px"
      alignItems={"center"}
      flexDir="column"
    >
      <Text
        fontSize={"24px"}
        fontWeight={"bold"}
        fontFamily={theme.fonts.roboto}
        color="gray.700"
        mb="5px"
      >
        My Account
      </Text>
      <Text
        fontSize={"12px"}
        textAlign="center"
        mt="5px"
        mb="30px"
        color={"gray.300"}
      >
        You can check your account details here
      </Text>
      <Flex
        w="100%"
        justifyContent={"space-between"}
        px="35px"
        height="18px"
        alignItems="center"
      >
        <Text fontSize={"13px"} color="gray.700" fontWeight={500}>
          Account Address
        </Text>
        {account && (
          <Text fontSize={"13px"} color="blue.200" fontWeight={500}>
            {trimAddress({
              address: account,
              firstChar: 6,
              lastChar: 5,
              dots: "....",
            })}
          </Text>
        )}
      </Flex>
      <Flex w="100%" px="20px">
        <Flex
          bg="white.100"
          w="100%"
          h="36px"
          border="1px solid #e7ebf2"
          mt="23px"
          borderRadius={"6px"}
          p="3px"
          mb="15px"
        >
          <Button
            w="50%"
            h="100%"
            bg={selectedTab === "account" ? "blue.200" : "white.100"}
            _focus={{ bg: "#2a72e5", color: "white.100" }}
            color={selectedTab === "account" ? "white.100" : "gray.1000"}
            fontSize={"13px"}
            fontWeight={500}
            onClick={() => setSelectedTab("account")}
          >
            Account
          </Button>
          <Button
            w="50%"
            h="100%"
            color={selectedTab === "history" ? "white.100" : "gray.1000"}
            bg={selectedTab === "history" ? "blue.200" : "white.100"}
            _focus={{ bg: "#2a72e5", color: "white.100" }}
            fontSize={"13px"}
            fontWeight={500}
            onClick={() => setSelectedTab("history")}
          >
            History
          </Button>
        </Flex>
      </Flex>

      {selectedTab === "account" ? (
        <AccountTab />
      ) : (
        <></>
        // <HistoryTab
        //   columns={historyColumns}
        //   data={userHistory}
        //   isLoading={tableLoading}
        // />
      )}
    </Flex>
  );
}

export default Account;
