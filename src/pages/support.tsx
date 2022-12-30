import { Box, Flex, Text, useMediaQuery, useColorMode, useTheme } from '@chakra-ui/react';
import PageHeader from "./components/layout/PageHeader";

function Support () {
  const theme = useTheme()
  return (
    <Flex minH={'80vh'} w={'100%'} mt={'36px'} flexDir={'column'} alignItems={'center'}>
      <PageHeader title={'Support'} subtitle={'We will guide you on how to stake TON in Tokamak Network'}/>
      <Box fontFamily={theme.fonts.roboto}>
        
      </Box>
    </Flex>
  );
}

export default Support;