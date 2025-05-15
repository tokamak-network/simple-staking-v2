import { Flex } from "@chakra-ui/react"

export default function ServiceTab(props: {
  setServiceTab: any,
  currentTab: string
}) {
  const { setServiceTab, currentTab } = props
  const tabs = [
    {
      name: 'User service',
      value: 'service'
    },
    {
      name: 'Operator',
      value: 'operator'
    }
  ]
  console.log(currentTab)
  return (
    <Flex
      w={'213px'}
      h={'30px'}
      ml={'65px'}
      padding={'3px'}
      border={'solid 1px #e7ebf2'}
      borderRadius={'6px'}
    >
      {
        tabs.map((tab: any) => {
          return [
            <Flex
              w={'102px'}
              h={'24px'}
              borderRadius={'5px'}
              bgColor={currentTab === tab.value ? '#2a72e5' : ''}
              color={currentTab === tab.value ? '#fff' : '#808992'}
              fontSize={'12px'}
              justifyContent={'center'}
              alignItems={'center'}
              cursor={'pointer'}
              onClick={()=>setServiceTab(tab.value)}
            >
              {tab.name}
            </Flex>
          ]
        })
      }
    </Flex>
  )
}