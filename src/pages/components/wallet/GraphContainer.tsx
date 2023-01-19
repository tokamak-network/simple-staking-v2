import { Button, Flex, Text, useTheme } from '@chakra-ui/react';
import { GraphSideContainer } from './graph/GraphSideContainer';
import { useAccumulatedReward } from '@/hooks/wallet/useAccumulatedReward';

function GraphContainer () {
  const theme = useTheme();
  const { accumulatedReward } = useAccumulatedReward()
  return (
    <Flex
      flexDir={'column'}
      w={'1100px'}
      h={'467px'}
      paddingY={'15px'}
      bg={'#fff'}
      borderRadius={'10px'}
      boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
      justifyContent={'center'}
      alignItems={'center'}
      mt={'30px'}
    >
      <Flex flexDir={'row'} h={'73px'} w={'100%'} px={'24px'} pb={'6px'} justifyContent={'space-between'} alignItems={'center'}>
        <Flex alignItems={'space-around'}>
          <Text mr='50px' fontSize={'20px'} fontWeight={500}>
            Reward
          </Text>
          <Flex>
            <Button
              {...theme.btnStyle.btnWalletPeriod()}
              mr={'10px'}
            >
              Week
            </Button>
            <Button 
              {...theme.btnStyle.btnWalletPeriod()}
            >
              Month
            </Button>
          </Flex>
        </Flex>
        <Flex> 

          <Button
            {...theme.btnStyle.btnWalletSearch()}
          >
            Search
          </Button>
        </Flex>
      </Flex>
      <Flex h={'393px'} borderTop={'1px'} borderColor={'#f4f6f8'} w={'100%'} >
        <Flex w={'982px'}>

        </Flex>
        <Flex w={'230px'} flexDir={'column'}>
          <GraphSideContainer 
            totalReward={accumulatedReward}
            totalStaked={''}
            totalWithdraw={''}
          />
        </Flex>
      </Flex>

    </Flex>
  )
}

export default GraphContainer