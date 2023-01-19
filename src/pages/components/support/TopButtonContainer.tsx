import { Flex, Text, Grid, GridItem, useTheme } from "@chakra-ui/react";

function TopButtonContainer(props: { refs: any }) {
  const { refs } = props;

  const buttons = [
    {
      name: "Introduction to Staking",
      id: "introduction",
    },
    {
      name: "Install Metamask",
      id: "install",
    },
    {
      name: "Login",
      id: "login",
    },
    {
      name: "Stake",
      id: "stake",
    },
    {
      name: "Un-stake",
      id: "unstake",
    },
    {
      name: "Re-stake",
      id: "restake",
    },
    {
      name: "Withdraw",
      id: "withdraw",
    },
    {
      name: "Wallet",
      id: "wallet",
    },
  ];

  const scrollMeTo = (indx: any) => {
    const refOfBtn = refs[indx];
    refOfBtn.current.scrollIntoView();
  };

  const SupportButton = (props: { btn: any; index: number }) => {
    const { btn, index } = props;
    const theme = useTheme();

    return (
      <Flex
        w="200px"
        h="42px"
        justifyContent={"center"}
        alignItems="center"
        bg={"white.300"}
        borderRadius="24px"
        fontSize={"13px"}
        color={"black.100"}
        fontFamily={theme.fonts.Roboto}
        boxShadow={"0 1px 3px 0 rgba(96, 97, 112, 0.16)"}
        fontWeight={"bold"}
        onClick={() => scrollMeTo(index)}
        _hover={{ cursor: "pointer" }}
        _active={{color:'white.100', backgroundColor:'blue.200'}}
        _focus={{color:'white.100', backgroundColor:'blue.200'}}
      >
        {btn.name}
      </Flex>
    );
  };

  return (
    <Flex flexDir={"row"} justifyContent={"center"} maxW={"1100px"} mb="60px">
      <Grid
        templateColumns="repeat(4, 1fr)"
        templateRows="repeat(2, 1fr)"
        rowGap={"32px"}
        columnGap="30px"
      >
        {buttons.map((bttn: any, index: number) => {
          return (
            <GridItem key={index}>
              <SupportButton btn={bttn} index={index} />
            </GridItem>
          );
        })}
      </Grid>
    </Flex>
  );
}

export default TopButtonContainer;
