import { useWindowDimensions } from "@/hooks/useWindowDimensions"
import { Flex } from "@chakra-ui/react"

type WithdrawTypeSelectorProps = {
  tab: any
  setTab: any
}

export const WithdrawTypeSelector = (args: WithdrawTypeSelectorProps) => {
  const {tab, setTab} = args

  const [width] = useWindowDimensions();
  const mobile = width && width < 1040;

  return (
    <Flex
      w={mobile ? '100%' : '213px'}
      h={mobile ? '40px' : '30px'}
      p={'3px'}
      border={'solid 1px #e7ebf2'}
      borderRadius={'5px'}
      fontSize={mobile ? '13px' :'12px'}
      fontWeight={mobile ? 500 : 'normal'}
      mt={mobile ? '' : '24px'}
      mb={'21px'}
      justifyContent={'space-between'}
    >
      <Flex
        w={mobile ? '50%' : '102px'}
        textAlign={'center'}
        h={mobile ? '30px' : '24px'}
        borderRadius={'5px'}
        color={tab === 'unstake' ? '#fff' : ''}
        bg={tab==="unstake" ? '#2a72e5' : '#fff'}
        justifyContent={'center'}
        alignItems={'center'}
        onClick={() => setTab('unstake')}
        cursor={'pointer'}
      >
        Unstake
      </Flex>
      <Flex
        w={mobile ? '50%' :'102px'}
        textAlign={'center'}
        h={mobile ? '30px' : '24px'}
        borderRadius={'5px'}
        color={tab === 'withdraw' ? '#fff' : ''}
        bg={tab === "withdraw" ? '#2a72e5' : '#fff'}
        justifyContent={'center'}
        alignItems={'center'}
        onClick={() => setTab('withdraw')}
        cursor={'pointer'}
      >
        Withdraw
      </Flex>
    </Flex>
  )
}