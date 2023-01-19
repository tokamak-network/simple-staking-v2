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
import withdraw_01 from "assets/images/support/withdraw_01.png";
import withdraw_02 from "assets/images/support/withdraw_02.png";

function Withdraw(props: { reef: any }) {
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
        Withdraw
      </Heading>
      <Flex mt="20px" justifyContent={"center"} alignItems="center" mb="30px">
        <Flex
          borderRadius={"10px"}
          m="30px"
          boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
        >
          <Image src={withdraw_01} alt={"withdraw_01"} />
        </Flex>
        <Flex
          borderRadius={"10px"}
          m="30px"
          boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
        >
          <Image src={withdraw_02} alt={"withdraw_02"} />
        </Flex>
      </Flex>
      <OrderedList>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            Press the <span style={{ fontWeight: "bold" }}>Withdraw</span>{" "}
            button and a popup will appear.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            Click the <span style={{ fontWeight: "bold" }}>Withdraw</span>{" "}
            button to withdraw all your TON at once.
          </Text>
        </ListItem>
        <ListItem color={"black.100"}>
          <Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
            Click the <span style={{ fontWeight: "bold" }}>Confirm</span> button
            of the Metamask popup to confirm the transaction.
          </Text>
        </ListItem>
      </OrderedList>
    </Flex>
  );
}

export default Withdraw;
