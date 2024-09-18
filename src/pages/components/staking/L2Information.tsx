import { getDate } from '@/components/getDate';
import { Box, Button, Flex } from '@chakra-ui/react';
import { FC, useMemo, useState } from 'react';
import L2Content from './L2Content';
import { convertNumber } from '@/components/number';
import { useIsOperator } from '@/hooks/staking/useIsOperator';
import L2InfoContent from './L2InfoContent';

type L2InformationProps = {
  data: any;
};

function L2Information({ data }: L2InformationProps) {
  // const {

  // } = data?.candidateAddOn
  const [editStat, setEditStat] = useState(false);

  console.log(data);
  // const a = useIsOperator(data?.candidateContract)
  // console.log(a)
  const layer2Seigs = data?.candidateAddOn.seigGiven[0]
    ? convertNumber({
        amount: data?.candidateAddOn.seigGiven[0].layer2Seigs,
        type: 'ray',
        localeString: true,
      })
    : '0.00';
  
    const l2TotalSeigs = data?.candidateAddOn.seigGiven[0]
    ? convertNumber({
        amount: data?.candidateAddOn.seigGiven[0].l2TotalSeigs,
        type: 'ray',
        localeString: true,
      })
    : '0.00';

  const converted = data?.lockedInBridge
    ? convertNumber({
        amount: data?.lockedInBridge,
        type: 'ray',
        localeString: true,
      })
    : '0.00';
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
        <Flex fontSize={'18px'} fontWeight={500} color={'#2a72e5'} flexDir={'row'} mb={'18px'}>
          <Flex>
            L2 Info
          </Flex>
          <Flex
            ml={'12px'}
            mt={'2px'}
          >
            {
              !editStat ?
              <Button 
                w={'59px'}
                h={'21px'}
                borderRadius={'4px'}
                border={'1px solid #dfe4ee'}
                bgColor={'#fff'}
                color={'#86929d'}
                fontSize={'12px'}
                fontWeight={400}
                onClick={() => setEditStat(true)}
              >
                Edit
              </Button> :
              <Flex>
                <Button 
                  w={'59px'}
                  h={'21px'}
                  borderRadius={'4px'}
                  border={'1px solid #2a72e5'}
                  bgColor={'#fff'}
                  color={'#2a72e5'}
                  fontSize={'12px'}
                  fontWeight={400}
                  onClick={() => setEditStat(false)}
                >
                  Confirm
                </Button>
                <Button 
                  w={'59px'}
                  h={'21px'}
                  ml={'6px'}
                  borderRadius={'4px'}
                  border={'1px solid #dfe4ee'}
                  bgColor={'#fff'}
                  color={'#86929d'}
                  fontSize={'12px'}
                  fontWeight={400}
                  onClick={() => setEditStat(false)}
                >
                  Cancel
                </Button>
              </Flex>
            }
          </Flex>
        </Flex>
        <Flex flexDir={'row'}>
          {
            editStat ? '' :
            <L2InfoContent title={'L2 Rollup Type'} content={'Titan Tokamak'} type={'string'} />
          }
          <L2InfoContent title={'Bridge'} content={'https://bridge.tokamak.network'} type={'bridge'} editStat={editStat} />
          <L2InfoContent title={'Block explorer'} content={'https://explorer.titan.tokamak.network'} type={'explorer'} editStat={editStat} />
          <L2InfoContent title={'L2 Logo'} content={data?.name} type={'logo'} editStat={editStat} />
        </Flex>
      </Flex>
      <Flex flexDir={'column'} my={'54px'}>
        <Flex fontSize={'18px'} fontWeight={500} color={'#2a72e5'} mb={'18px'}>
          Sequencer seigniorage
        </Flex>
        <Flex flexDir={'row'}>
          <L2Content title={'TON locked in Bridge'} content={converted} type={'ton'} />
          <L2Content
            title={'Earned seigniorage'}
            content={layer2Seigs}
            content2={l2TotalSeigs}
            type={'seig'}
            contractAddress={data?.candidateContract}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default L2Information;
