import { Box, Flex, Text, useMediaQuery, useTheme } from "@chakra-ui/react";
import Image from "next/image";
import Sub_Logo from 'assets/images/Sub_Logo.png'

function MobileHome () {
const theme = useTheme()
  return (
    <Flex w='100%' height={'100%'} border={'1px solid red'} pt='40px' alignItems={'center'} flexDir='column'>
        <Image src={Sub_Logo}  alt='Sub_Logo' height={60} width={170}/>
        <Text fontSize={'24px'} fontWeight={'bold'} mt='25px' color='gray.700' fontFamily={theme.fonts.roboto}>Tokamak Network</Text>
        <Text fontSize={'12px'} textAlign='center' mt='5px' w='200px' color={'gray.300'}>Stake your TON to earn Power TON and other rewards</Text>
    </Flex>
  )
}

export default MobileHome