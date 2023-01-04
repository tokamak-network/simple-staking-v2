import {
  Flex,
  Text,
  Heading,
  useTheme,
  UnorderedList,
  OrderedList,
  ListItem,
  Link,
} from "@chakra-ui/react";
import wallet from "assets/images/support/wallet.png";
import SupportImage from "./SupportImage";

function Wallet(props: { reef: any }) {
  const theme = useTheme();
  const { reef } = props;

  return (
    <Flex ref={reef} flexDir="column" fontFamily={theme.fonts.Roboto} mt="40px">
      <Heading
        size={"md"}
        color={"blue.200"}
        fontSize="20px"
        fontWeight={500}
        mb="40px"
      >
        Wallet
      </Heading>
      <SupportImage src={wallet} />
      <Text
        {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}
        mt={"40px"}
        mb="10px"
      >
        After connecting your wallet, you can access the following information
        about your assets in the Wallet page.
      </Text>
      <OrderedList>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            <span style={{ fontWeight: "bold" }}>Total Staked:</span> Sum of
            your total staked.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            <span style={{ fontWeight: "bold" }}>Pending Withdrawal:</span> Sum
            of your unstaked request amount. However, Unstaked TON can only be
            withdrawn after a withdrawal delay period set by the operator
            (default is 93046 blocks, approximately 2 weeks).
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            <span style={{ fontWeight: "bold" }}>
              Total Accumulated Reward:{" "}
            </span>
            Sum of the reward you accumulated since you started staking.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            <span style={{ fontWeight: "bold" }}>Power:</span> Amount of
            PowerTON you own and your probability of winning the next PowerTON
            round.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            <span style={{ fontWeight: "bold" }}>Reward: </span>Amount of TON
            you earned over a given period. You can select your desired period.
            The graph will show your daily reward amounts during the selected
            period.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            <span style={{ fontWeight: "bold" }}>Analysis of Reward</span>
          </Text>
          <UnorderedList color={"black.100"}>
            <ListItem>
              <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
                <span style={{ fontWeight: "bold" }}>Total Reward: </span>Sum of
                your reward during that period.{" "}
              </Text>
            </ListItem>
            <ListItem>
              <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
                <span style={{ fontWeight: "bold" }}>Total Staked: </span>Sum of
                your staked during that period.{" "}
              </Text>
            </ListItem>
            <ListItem>
              <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
                <span style={{ fontWeight: "bold" }}>Total Withdraw: </span>Sum
                of your withdrew TON since you started staking.
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            <span style={{ fontWeight: "bold" }}>History:</span> History of all
            your transactions. THe information includes Transaction Hash,
            Operator Contract, Type, Amount, Block Number and Status.
          </Text>
        </ListItem>
      </OrderedList>
    </Flex>
  );
}

export default Wallet;
