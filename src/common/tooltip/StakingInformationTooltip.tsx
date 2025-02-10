import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import {
  Flex,
} from "@chakra-ui/react";
import BasicTooltip from ".";

type StakingInformationTooltipProps = {
  title: string
  tooltip: string
  value: string | number
  unit: string
  widths?: string
}

export const StakingInformationTooltip = (args: StakingInformationTooltipProps) => {
  const {
    title,
    tooltip,
    value,
    unit,
    widths
  } = args

  const [ width ] = useWindowDimensions();
  const mobile = width && width < 1040;

  return (
    <Flex 
      flexDir={mobile ? 'row' : 'column'}
      justifyContent={mobile ? 'space-between' : 'center'}
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
          <BasicTooltip label={tooltip} width={widths}/>
        </Flex>
      </Flex>
      <Flex
        h={'27px'}
        fontWeight={mobile ? 400 : 700}
        fontSize={mobile ? '13px' : '18px'}
        color={'#3d495c'}
        alignItems={mobile ? 'center' : 'end'}
      >
        <Flex>
          {value}
        </Flex>
        <Flex
          ml={'3px'}
          fontSize={'13px'}
          mb={mobile ? '' : '2px'}
        >
          {unit}
        </Flex>
      </Flex>
    </Flex>
  )
}