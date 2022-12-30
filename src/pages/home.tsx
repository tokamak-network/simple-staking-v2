import { Box, Flex, Text, useMediaQuery, useTheme } from "@chakra-ui/react";
import MAP from '@/assets/images/map.png'
import Image from "next/image";

function Home () {
  const theme = useTheme();
  return (
    <Box minH={'80vh'} w={'100%'} mt={'36px'}>
      <Flex flexDir={'column'} alignItems={'center'} fontSize={'32px'} fontWeight={600} pos={'relative'}>
        <Image
          src={MAP}
          alt={'map'}
        >
        </Image>
        <Flex position={'absolute'} flexDir={'column'} alignItems={'center'}>
          <Text h={'58px'} fontFamily={theme.fonts.TitilliumWeb} >
            There is currently
          </Text>
          <Text color={'#2a72e5'} h={'76px'} mt={'25px'} fontFamily={theme.fonts.TitilliumWeb}>{} TON</Text>
          <Text h={'48px'} color={'#3d495d'} mt={'25px'} fontFamily={theme.fonts.TitilliumWeb}>Staked in the</Text>
          <Text h={'42px'} mt={'20px'} fontSize={'38px'} fontFamily={theme.fonts.Nanum}>Tokamak Network</Text>
        </Flex>
        
      </Flex>
      
    </Box>
  );
}

export default Home;