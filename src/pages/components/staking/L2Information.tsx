import { Box, Flex } from "@chakra-ui/react";
import { FC, useMemo } from "react";
import { L2Content } from "./L2Content";

type L2InformationProps ={
  data: any
}

export const L2Information: FC<L2InformationProps> = ({
  data
}) => {

  return (
    <Flex
      w="100%"
      m={0}
      justifyContent={'space-between'}
      alignItems="start"
      // pt="70px"
      border={'none'}
      flexDir={'column'}
      ml={'70px'}
    >
      <Flex flexDir={'column'} mt={'36px'}>
        <Flex
          fontSize={'18px'}
          fontWeight={500}
          color={'#2a72e5'}
          flexDir={'column'}
          mb={'18px'}
        >
          Service URL
        </Flex>
        <Flex
          flexDir={'row'}
        >
          <L2Content 
            title={'Bridge'}
            content={data.candidateContract}
            type={'address'}
          />
          <L2Content 
            title={'Block explorer'}
            content={'https://explorer.titan.tokamak.network'}
            type={'link'}
          />

        </Flex>
      </Flex>
      <Flex flexDir={'column'} my={'54px'}>
        <Flex
          fontSize={'18px'}
          fontWeight={500}
          color={'#2a72e5'}
          mb={'18px'}
        >
          Sequencer seigniorage
        </Flex>
        <Flex
          flexDir={'row'}
        >
          <L2Content 
            title={'L2 registry registered date'}
            content={'2023.4.23'}
            type={'date'}
          />
          <L2Content 
            title={'L2 open date'}
            content={''}
            type={'date'}
          />
          <L2Content 
            title={'TON locked in Bridge'}
            content={''}
            type={'ton'}
          />
          <L2Content 
            title={'Earned seigniorage'}
            content={''}
            type={'ton'}
          />

        </Flex>
      </Flex>

    </Flex>
  )
}