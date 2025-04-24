// import { CalculatorBody } from './CalculatorBody';

import { Flex, Input, Select, Text } from '@chakra-ui/react';
import { BalanceInput } from '@/common/input/CustomInput';
import { useRecoilState } from 'recoil';
import { Duration, durationState } from '@/atom/staking/duration';

export const CalculatorBodyRow = (args: { title: string; value: any }) => {
  const [duration, setDuration] = useRecoilState(durationState);
  const { title, value } = args;

  return (
    <Flex flexDir={'row'} h={'55px'} justifyContent={'space-between'} alignItems={'center'} w={'100%'}>
      <Text fontSize={'14px'} fontWeight={500} color={'#3d495d'} w={'110px'}>
        {title}
      </Text>
      <Flex w={'171px'} h={'32px'}>
        {title === 'Stake' ? (
          <BalanceInput w={'120px'} h={'32px'} placeHolder={'0'} type={'calculator'} maxValue={value} />
        ) : title === 'Total Staked' ? (
          <Flex
            w={'181px'}
            borderRadius={'4px'}
            border={'solid 1px #dfe4ee'}
            flexDir={'row'}
            justifyContent={'end'}
            alignItems={'center'}
            color={'#3e495c'}
            fontSize={'13px'}
            pr={'10px'}
          >
            {value} TON
          </Flex>
        ) : (
          <Select
            h={'32px'}
            fontSize={'13px'}
            defaultValue={duration}
            onChange={(e) => {
              setDuration(e.target.value as Duration);
            }}
          >
            <option value={'1-year'}>1 Year</option>
            <option value={'6-month'}>6 Month</option>
            <option value={'3-month'}>3 Month</option>
            <option value={'1-month'}>1 Month</option>
          </Select>
        )}
      </Flex>
    </Flex>
  );
};

export default CalculatorBodyRow;
