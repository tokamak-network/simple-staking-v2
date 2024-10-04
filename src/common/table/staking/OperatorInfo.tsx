import { Flex, Text } from "@chakra-ui/react"

type InfoType ={
  title: string;
  value: string | number | undefined
  unit: string
}

export const Info = (args: InfoType) => {
  const {title, value, unit} = args
  return (
    <Flex 
      color={'#86929d'}
      w={
        title === 'Total Staked'
        ? '235px'
        : title === 'Commission Rate'
        ? '160px'
        : title === 'Your Staked'
        ? '220px'
        : '10px'
      }
      fontWeight={400}
      fontSize={'13px'}
    >
      <Text mr={'10px'}>{title}</Text>
      <Text>{value}{' '}{unit}</Text>
    </Flex>
  )
}

export default Info
