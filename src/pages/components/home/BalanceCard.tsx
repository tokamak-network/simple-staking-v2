import { Box, Flex, Text, useMediaQuery, useTheme } from "@chakra-ui/react";

function BalanceCard(props: { title: string; subTitle?: string; amount: string; subAmount?: string; wtonAmount?: string }) {
  const { title, subTitle,amount,subAmount, wtonAmount } = props;
  const theme = useTheme();
  return (
    <Flex
      w="320px"
      h={subTitle ?"146px" : '201px' }
      bg="white.100"
      borderRadius={"10px"}
      border="solid 1px #e7ebf2"
      mb="20px"
      px='20px'
      pt='20px'
      pb='15px'
      flexDir={'column'}
      alignItems={'center'}
    >
      <Text 
        color={'gray.300'} 
        fontSize='12px' 
        lineHeight={'16px'} 
        mb='5px'
      >
        {title}
      </Text>
      <Text 
        fontSize={'30px'} 
        color='black.300' 
        fontWeight={500} 
        mb='20px' 
        height={'39px'}
      >
        {amount} <span style={{fontSize:'11px'}}>TON</span>
      </Text>
      <Flex w='100%' h={'1px'} bg='gray.800' />
      {
        wtonAmount ?
        <Flex
          justifyContent={'center'}
          alignItems={'center'}
          flexDir={'column'}
          borderTop={'1px'}
          borderColor={'gray.800'}
          pt={'15px'}
          w={'100%'}
        >
          <Text 
            color={'gray.300'} 
            fontSize='12px' 
            lineHeight={'16px'} 
            mb='5px'
          >
            Your WTON Balance
          </Text>
          <Text 
            fontSize={'30px'} 
            color='black.300' 
            fontWeight={500} 
            mb='20px' 
            // height={'39px'}
          >
            {wtonAmount} <span style={{fontSize:'11px'}}>WTON</span>
          </Text>
        </Flex> : ''
      }
      {
        subTitle && 
        <Flex justifyContent={'space-between'} w='100%' fontSize={'11px'} h='15px' mt='13px'>
          <Text color='gray.300'>{subTitle}</Text>
          <Text color='gray.900' fontWeight={500}>{subAmount} TON</Text>
        </Flex>
      }
    </Flex>
  );
}

export default BalanceCard;
