import { BalanceTooltip } from "@/common/tooltip/BalanceTooltip";
import { Flex, Text } from "@chakra-ui/react"

type InfoType ={
  title: string;
  value: string | undefined
  unit: string
}

export const Info = (args: InfoType) => {
  const {title, value, unit} = args
  return (
    <Flex 
      color={
        title === 'Your Staked'
        ? '#304156' : '#86929d'
      }
      w={
        title === 'Total Staked'
        ? '235px'
        : title === 'Staking APY'
        ? '195px'
        : title === 'Your Staked'
        ? '220px'
        : '10px'
      }
      fontWeight={400}
      fontSize={'13px'}
      flexDir={'row'}
    >
      <Text mr={'10px'}>{title}</Text>
      {
        title === 'Staking APY' ?
          <Text flexDir={'row'}>
            {value}{' '}{unit}
          </Text> 
        : 
        <Flex>
          <BalanceTooltip 
            label={value}
            types={'ray'}
          />
          <Flex ml={'3px'}>
            TON
          </Flex>
        </Flex>
      }
    </Flex>
  )
}

export default Info
