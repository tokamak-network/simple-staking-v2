import {
  Tooltip,
  useColorMode,
  PlacementWithLogical,
  Text,
  Flex,
  Link
} from "@chakra-ui/react";
import BasicTooltip from ".";

type StakingInformationTooltipProps = {
  title: string
  tooltip: string
  value: string | number
  unit: string
}

export const StakingInformationTooltip = (args: StakingInformationTooltipProps) => {
  const {
    title,
    tooltip,
    value,
    unit
  } = args

  return (
    <Flex 
      flexDir={'column'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Flex h={'12px'}>
        <Flex
          fontWeight={400}
          fontSize={'12px'}
          color={'#808992'}
          alignItems={'center'}
        >
          {title}
        </Flex>
        <Flex ml={'2px'}>
          <BasicTooltip label={tooltip} />
        </Flex>
      </Flex>
      <Flex
        h={'27px'}
        fontWeight={700}
        fontSize={'18px'}
        color={'#3d495c'}
        alignItems={'end'}
      >
        <Flex>
          {value}
        </Flex>
        <Flex
          ml={'3px'}
          fontSize={'13px'}
          mb={'2px'}
        >
          {unit}
        </Flex>
      </Flex>
    </Flex>
  )
}