import { getDate } from "@/components/getDate";
import { Box, Flex } from "@chakra-ui/react";
import { FC, useMemo } from "react";
import L2Content from "./L2Content";
import { convertNumber } from "@/components/number";
import { useIsOperator } from "@/hooks/staking/useIsOperator";

type L2InformationProps ={
  data: any
}

function L2Information ({
  data
}: L2InformationProps) {
  // const {
    
    
  // } = data?.layer2Candidate

  // console.log(data)
  // const a = useIsOperator(data.candidateContract)
  // console.log(a)
  const earned = data?.layer2Candidate.seigGiven[0] ?  convertNumber({
    amount: data?.layer2Candidate.seigGiven[0].layer2Seigs,
    type: 'ray',
    localeString: true
  }) : '0.00'

  const converted = data?.lockedInBridge ? convertNumber({
    amount: data?.lockedInBridge,
    type: 'ray',
    localeString: true
  }) : '0.00'
  // console.log(converted)

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
            content={data?.candidateContract}
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
            content={getDate(data?.layer2Candidate?.registeredTime)}
            type={'date'}
          />
          <L2Content 
            title={'L2 open date'}
            content={getDate(data?.layer2Candidate?.registeredTime)}
            type={'date'}
          />
          <L2Content 
            title={'TON locked in Bridge'}
            content={converted}
            type={'ton'}
          />
          <L2Content 
            title={'Earned seigniorage'}
            content={earned}
            type={'ton'}
          />

        </Flex>
      </Flex>

    </Flex>
  )
}

export default L2Information