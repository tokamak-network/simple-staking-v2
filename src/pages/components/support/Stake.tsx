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
import Image from "next/image";
import stake_1 from "assets/images/support/stake_1.png";
import stake_2 from "assets/images/support/stake_2.png";
import stake_3 from "assets/images/support/stake_3.png";
import stake_4 from "assets/images/support/stake_4.png";
import stake_5 from "assets/images/support/stake_5.png";
import stake_6 from "assets/images/support/stake_6.png";
import stake_7 from "assets/images/support/stake_7.png";
import SupportImage from "./SupportImage";

function Stake(props: { reef: any }) {
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
        Stake
      </Heading>
      <SupportImage src={stake_1} />

      <Text
        fontSize="17px"
        color={"blue.200"}
        fontWeight={700}
        mt={"40px"}
        mb="10px"
      >
        Select Operator
      </Text>
      <OrderedList>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            Select the operator you want to delegate from the Operator list by
            clicking the unfold button. You can see information of operators
            such as Total Delegates, Pending Withdrawal, Recent Commit, Commit
            Count, Staking history, and Commit history.
          </Text>
        </ListItem>
        <Flex mt="20px" justifyContent={"center"} alignItems="center">
          <Flex
            borderRadius={"10px"}
            height={"30%"}
            width={"30%"}
            m="30px"
            boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
          >
            <Image src={stake_2} alt={"stake_2"} />
          </Flex>
          <Flex
            borderRadius={"10px"}
            m="30px"
            height={"30%"}
            width={"30%"}
            boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
          >
            <Image src={stake_3} alt={"stake_3"} />
          </Flex>
          <Flex
            borderRadius={"10px"}
            m="30px"
            height={"30%"}
            width={"25%"}
            boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
          >
            <Image src={stake_4} alt={"stake_4"} />
          </Flex>
        </Flex>
      </OrderedList>
      <Text
        fontSize="17px"
        color={"blue.200"}
        fontWeight={700}
        mt={"40px"}
        mb="10px"
      >
        Stake TON to Operator
      </Text>
      <OrderedList>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            Press the Stake button and a popup will appear.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            Insert the amount of TON to stake.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            Click the <span style={{ fontWeight: "bold" }}>Stake</span> button.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            If you want to close the popup, click the{" "}
            <span style={{ fontWeight: "bold" }}>X</span> button.
          </Text>
          <UnorderedList>
            <ListItem>
              <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
                Once staked, there will be a delay for the duration set by the
                operator upon withdrawal request. (Default is 93046 blocks,
                approximately 2 weeks)
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            Click the confirm button of the Metamask popup that will open from
            the Metamask extension of your browswer.
          </Text>
          <UnorderedList>
            <ListItem>
              <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
                Once staked, there will be a delay for the duration set by the
                operator upon withdrawal request. (Default is 93046 blocks,
                approximately 2 weeks)
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>
      </OrderedList>
      <Flex mt="20px" justifyContent={"center"} alignItems="center">
        <Flex
          borderRadius={"10px"}
          height={"30%"}
          width={"30%"}
          m="30px"
          boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
        >
          <Image src={stake_5} alt={"stake_5"} />
        </Flex>
        <Flex
          borderRadius={"10px"}
          m="30px"
          height={"30%"}
          width={"30%"}
          boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
        >
          <Image src={stake_6} alt={"stake_6"} />
        </Flex>
        <Flex
          borderRadius={"10px"}
          m="30px"
          height={"30%"}
          width={"30%"}
          boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
        >
          <Image src={stake_7} alt={"stake_7"} />
        </Flex>
      </Flex>
      <Text
        fontSize="17px"
        color={"blue.200"}
        fontWeight={700}
        mt={"40px"}
        mb="10px"
      >
        Staking Calculator
      </Text>
      <OrderedList>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            Press the Simulator button and a popup will appear.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            Insert the amount of TON to stake.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            Select duration you want to stake.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            Click the <span style={{ fontWeight: "bold" }}>Calculate</span>{" "}
            button.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            If you want to close popup, click the{" "}
            <span style={{ fontWeight: "bold" }}>X</span> button.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            Estimated amount of TONs you will earn during the selected period
            will appear here.
          </Text>
        </ListItem>

        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            The USD value, the APY, and the KRW value of the amount of TON you
            will earn will appear here.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            If you click the <span style={{ fontWeight: "bold" }}>Stake</span>{" "}
            button, the staking popup will appear.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            If you want to recalculate, click the{" "}
            <span style={{ fontWeight: "bold" }}>Recalculate</span> button.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            If you want to close popup, click the{" "}
            <span style={{ fontWeight: "bold" }}>X</span> button.
          </Text>
        </ListItem>
      </OrderedList>
    </Flex>
  );
}
export default Stake;
