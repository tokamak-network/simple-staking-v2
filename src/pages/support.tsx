import { Box, Flex, useTheme } from "@chakra-ui/react";
import { useRef } from "react";
import Image from "next/image";
import PageHeader from "./components/layout/PageHeader";
import TopButtonContainer from "./components/support/TopButtonContainer";
import logo from "assets/images/tokamak-staking-simple.png";
import SupportImage from "./components/support/SupportImage";
import Introduction from "./components/support/Introduction";
import Install from "./components/support/Install";
import Login from "./components/support/Login";
import Stake from "./components/support/Stake";
import Unstake from "./components/support/Unstake";
import Restake from "./components/support/Restake";
import Withdraw from "./components/support/Withdraw";
import Wallet from "./components/support/Wallet";
import top_arrow_icon from "assets/images/top_arrow_icon.png";
function Support() {
  const theme = useTheme();
  const topRef = useRef<null | HTMLDivElement>(null);
  const introRef = useRef();
  const installRef = useRef();
  const loginRef = useRef();
  const stakeRef = useRef();
  const unstakeRef = useRef();
  const restakeRef = useRef();
  const withdrawRef = useRef();
  const walletRef = useRef();

  const scrollToTop = () => {
    topRef?.current?.scrollIntoView();
  };
  return (
    <Flex
      minH={"80vh"}
      w={"100%"}
      mt={"36px"}
      flexDir={"column"}
      alignItems={"center"}
      ref={topRef}
    >
      <PageHeader
        title={"Support"}
        subtitle={"We will guide you on how to stake TON in Tokamak Network"}
      />
      <Box
        fontFamily={theme.fonts.roboto}
        height={"100%"}
        maxW={"1100px"}
        w="100%"
      >
        <TopButtonContainer
          refs={[
            introRef,
            installRef,
            loginRef,
            stakeRef,
            unstakeRef,
            restakeRef,
            withdrawRef,
            walletRef,
          ]}
        />
        <SupportImage src={logo} height={"100px"} width={"730px"} />
        <Introduction reef={introRef} />
        <Install reef={installRef} />
        <Login reef={loginRef} />
        <Stake reef={stakeRef} />
        <Unstake reef={unstakeRef} />
        <Restake reef={restakeRef} />
        <Withdraw reef={withdrawRef} />
        <Wallet reef={walletRef} />
        <Flex
          position={"fixed"}
          bottom="90px"
          right="50px"
          onClick={() => scrollToTop()}
        >
          <Image src={top_arrow_icon} alt={"top_arrow_icon"} />
        </Flex>
      </Box>
    </Flex>
  );
}

export default Support;
