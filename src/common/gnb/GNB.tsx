"use client";
import { Flex, Link, Text, useTheme } from "@chakra-ui/react";
import "@fontsource/titillium-web/600.css";

function GNB() {
  function Menu(props: any) {
    const theme = useTheme();
    return (
      <Link
        h={"46px"}
        lineHeight={"44px"}
        textAlign={"center"}
        cursor={"pointer"}
        bg={props.activetab ? "#FFFFFF" : ""}
        color={props.activetab ? "#353C48" : ""}
        fontFamily={"Titillium Web, sans-serif"}
        fontWeight={600}
        target={props.title === "Bridge & Swap" ? "_blank" : "_self"}
        {...props}
        outline={"none"}
        _hover={{
          outline: "none",
        }}
        _focus={{
          outline: "none",
        }}
        href={props.url}
      >
        {props.title}
      </Link>
    );
  }

  return (
    <Flex
      w={"100%"}
      minW={"100%"}
      h={"45px"}
      bg={"#2775ff"}
      color={"#ffffff"}
      fontSize={15}
      // fontWeight={"bold"}
      justifyContent={"center"}
    >
      <Menu
        title={"Tokamak Network"}
        w={"158px"}
        url={"https://tokamak.network/#/"}
      ></Menu>
      <Menu
        title={"L2 Mainnet"}
        w={"112px"}
        url={"https://titan.tokamak.network"}
      ></Menu>
      <Menu
        title={"Bridge & Swap"}
        w={"136px"}
        url={"https://bridge.tokamak.network"}
      ></Menu>
      <Menu
        title={"Staking"}
        w={"90px"}
        activetab={"true"}
        url={"https://simple.staking.tokamak.network/"}
      ></Menu>

      <Menu
        title={"DAO"}
        w={"68px"}
        url={"https://dao.tokamak.network/#/"}
      ></Menu>
      <Menu
        title={"Launchpad"}
        w={"110px"}
        url={"https://tonstarter.tokamak.network/"}
      ></Menu>
    </Flex>
  );
}

export default GNB;
