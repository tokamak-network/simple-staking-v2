import { Flex, Input, Text } from '@chakra-ui/react';
import { CalculatorBodyRow } from './CalculatorBodyRow';

export const CalculatorBody = (args: { userBalance: string | undefined; totalStaked: string | undefined }) => {
  const { userBalance, totalStaked } = args;

  return (
    <Flex flexDir={'column'} py={'13px'} px={'30px'}>
      <CalculatorBodyRow title={'Stake'} value={userBalance} />
      <CalculatorBodyRow title={'Duration'} value={''} />
    </Flex>
  );
};

export default CalculatorBody;
