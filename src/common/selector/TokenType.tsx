import { useWindowDimensions } from "@/hooks/useWindowDimensions"
import { Flex } from "@chakra-ui/react"

type TokenTypeSelectorProps = {
  tab: any
  setTab: any
}

export const TokenTypeSelector = (args: TokenTypeSelectorProps) => {
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
        color={tab === 'ton' ? '#fff' : ''}
        bg={tab==="ton" ? '#2a72e5' : '#fff'}
        justifyContent={'center'}
        alignItems={'center'}
        onClick={() => setTab('ton')}
        cursor={'pointer'}
      >
        TON
      </Flex>
      <Flex
        w={mobile ? '50%' :'102px'}
        textAlign={'center'}
        h={mobile ? '30px' : '24px'}
        borderRadius={'5px'}
        color={tab === 'wton' ? '#fff' : ''}
        bg={tab === "wton" ? '#2a72e5' : '#fff'}
        justifyContent={'center'}
        alignItems={'center'}
        onClick={() => setTab('wton')}
        cursor={'pointer'}
      >
        WTON
      </Flex>
    </Flex>
  )
}