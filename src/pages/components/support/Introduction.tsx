import {
  Flex,
  Text,
  Heading,
  useTheme,
  UnorderedList,
  OrderedList,
  ListItem,
} from "@chakra-ui/react";
import { useRef } from "react";
import SupportImage from "./SupportImage";
import home_01 from "assets/images/support/home_01.png";

function Introduction(props: {reef:any}) {
    const {reef} = props;
  const theme = useTheme();

  return (
    <Flex
      ref={reef}
      flexDir="column"
      fontFamily={theme.fonts.Roboto}
      mt="40px"
    >
      <Heading
        size={"md"}
        color={"blue.200"}
        fontSize="20px"
        fontWeight={500}
        mb="20px"
      >
        Introduction to Staking
      </Heading>
      <Text fontSize="17px" color={"blue.200"} fontWeight={700}>
        What is staking?
      </Text>
      <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
        {" "}
        The word staking comes from the word stake. Stake means to support, or
        to secure something, such as a tent. In the blockchain space, staking
        means to deposit tokens to support the network by verifying transactions
        and sustaining its stability.
      </Text>
      <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
        {" "}
        The background for the creation of staking in blockchain is related to
        how blocks are verified. Originally Proof of Work was to secure and
        verify the network, but it was inefficient as it wastes a large amount
        of electricity. Proof of Stake came about as an alternative to Proof of
        Work.
      </Text>
      <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
        {" "}
        As a part of DeFi, staking has become a popular financial instrument,
        but in reality it was created for the security of blockchain networks
        and to incentivize those participating in the operation of the network.
        Participants stake tokens as deposits, and the network provides them
        with interest as a reward for offering this service. Staking with
        Tokamak Network is similar but different.
      </Text>
      <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()} mb={"90px"}>
        Typical Staking based blockchains have one chain with various operators
        and thus the trust of operators wasn’t a significant factor. But for
        Tokamak Networks Layer 2 chains, anyone can open and run a plasma and
        roll-up chain. Because of this, the chain economy must be structured
        that anyone can trust the operator and the data of the L2 chain. The
        Tokamak Network staking system allows for the creation of this
        credibility.
      </Text>
      <SupportImage src={home_01} />
      <Text
        fontSize="17px"
        color={"blue.200"}
        fontWeight={700}
        mt={"40px"}
        mb="10px"
      >
        Main Composition of Tokamak Network Simple Staking
      </Text>
      <OrderedList>
        <ListItem color={"blue.200"}>
          <Text fontSize={"18px"} fontWeight="normal" mb="10px">
            Home
          </Text>
          <UnorderedList color={"black.100"}>
            <ListItem>
              <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
                Click the{" "}
                <span style={{ fontWeight: "bold" }}>Connect Wallet</span>{" "}
                button to connect your metamask wallet or your Wallet Connect
                wallet to our staking service.
              </Text>
            </ListItem>
            <ListItem>
              <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
                The <span style={{ color: "#2a72e5" }}>Blue</span> graph shows
                the daily staked amount in the Tokamak Network by our stakers
                and the <span style={{ color: "#c7d1d8" }}>Gray</span> graph
                shows the daily Actual APY. Hover over the graphs to see the
                daily amounts of total staking and Actual APY.{" "}
              </Text>
            </ListItem>
            <ListItem>
              <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
                You can check PowerTON round information such as Round started
                date, round prize, and round end date under the graphs.
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem color={"blue.200"}>
          <Text fontSize={"18px"} fontWeight="normal" mb="10px">
            Staking
          </Text>
          <UnorderedList color={"black.100"}>
            <ListItem>
              <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
                {" "}
                You can see information about our operators on the staking page.
                Click on the blue arrow to the right of each operator to see
                detailed information about the operator and staking buttons when
                you have connected your wallet. When you haven't connected your
                wallet, you can only see the details of the operator.
              </Text>
            </ListItem>
            <ListItem>
              <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
                When your wallet is connected, you can click the staking buttons
                to stake your TON. For more information please check the Stake,
                Un-stake, Re-stake, or Withdraw sections.{" "}
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem color={"blue.200"}>
          <Text fontSize={"18px"} fontWeight="normal" mb="10px">
            PowerTON
          </Text>
          <UnorderedList color={"black.100"}>
            <ListItem>
              <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
                Power is issued on the basis of contribution to the network, the
                same as the distribution of commit reward, thereby distributing
                additional reward. Power is not available for purchase or
                transaction and can only be obtained through contributing to the
                Tokamak Network, and the more delegates it has, the more Power
                it grows.
              </Text>
            </ListItem>
            <ListItem>
              <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
                You can see the PowerTON round information and past round
                winners and ranks in this page. For more information please go
                to the PowerTON section
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem color={"blue.200"}>
          <Text fontSize={"18px"} fontWeight="normal" mb="10px">
          Wallet
          </Text>
          <UnorderedList color={"black.100"}>
            <ListItem>
              <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
              Wallet gives you personal information about your assets.
              </Text>
            </ListItem>
            <ListItem>
              <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
              Using the graph, you can check your daily rewards within a desired time period. For more information please check the Wallet section.
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>
      </OrderedList>
    </Flex>
  );
}

export default Introduction;
