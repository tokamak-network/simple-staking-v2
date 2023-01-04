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
import metamask_chrome from "assets/images/metamask_chrome.png";
import metamask_firefox from "assets/images/metamask_firefox.png";
import metamask_01 from "assets/images/support/metamask_01.png";
import metamask_02 from "assets/images/support/metamask_02.png";
import metamask_03 from "assets/images/support/metamask_03.png";

function Install(props: { reef: any }) {
  const theme = useTheme();
  const { reef } = props;

  return (
    <Flex ref={reef} flexDir="column" fontFamily={theme.fonts.Roboto} mt="40px">
      <Heading
        size={"md"}
        color={"blue.200"}
        fontSize="20px"
        fontWeight={500}
        mb="20px"
      >
        Install Metamask
      </Heading>
      <OrderedList {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
        <ListItem>
          Please install the Metamask extension on your{" "}
          <Link
            color={"blue.100"}
            isExternal
            href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
          >
            Google Chrome
          </Link>{" "}
          or
          <Link
            color={"blue.100"}
            isExternal
            href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
          >
            {" "}
            Firefox
          </Link>{" "}
          browser if you would like to connect to our service with Metamask. If
          your TON is already in a Metamask wallet, please login to that wallet,
          or import an account that already has TON.
        </ListItem>
        <Flex>
          <Flex
            m="30px"
            borderRadius={"10px"}
            boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
          >
            <Image src={metamask_chrome} alt={"metamask_chrome"} />
          </Flex>
          <Flex
            m="30px"
            borderRadius={"10px"}
            boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
          >
            <Image src={metamask_firefox} alt={"metamask_firefox"} />
          </Flex>
        </Flex>
        <ListItem {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
          To add TON on your wallet, make sure you're connected to the{" "}
          <span style={{ fontWeight: "bold" }}>Ethereum Mainnet</span> network.
          Then click the <span style={{ fontWeight: "bold" }}>Add Token</span>{" "}
          button.
        </ListItem>
        <ListItem {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
          Click the <span style={{ fontWeight: "bold" }}>Custom Token</span>{" "}
          tab.
        </ListItem>
        <ListItem {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
          Insert contract address as shown in the image below. The Token Symbol
          and Decimals of Precision will be filled automatically.
          <UnorderedList>
            <ListItem>
              Token Contract Address:{" "}
              <span style={{ fontWeight: "bold" }}>
                0x2be5e8c109e2197D077D13A82dAead6a9b3433C5
              </span>
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
          Click the <span style={{ fontWeight: "bold" }}>Next</span> button.
        </ListItem>
        <ListItem {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
          <span style={{ fontWeight: "bold" }}>Add Tokens</span> button in the
          next screen to add TON to your account.
        </ListItem>
      </OrderedList>
      <Flex mt="30px">
        <Flex
          borderRadius={"10px"}
          m="30px"
          boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
        >
          <Image src={metamask_01} alt="metamask_01" />
        </Flex>
        <Flex
          borderRadius={"10px"}
          m="30px"
          boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
        >
          <Image src={metamask_02} alt="metamask_02" />
        </Flex>
        <Flex
          borderRadius={"10px"}
          m="30px"
          boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
        >
          <Image src={metamask_03} alt="metamask_03" />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Install;
