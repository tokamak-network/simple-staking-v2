import { Flex, Text } from "@chakra-ui/react"

export const Info = (title: string, value: string | number | undefined, unit: string) => {
  return (
    <Flex color={'#86929d'}>
      <Text mr={'10px'}>{title}</Text>
      <Text>{value}{unit}</Text>
    </Flex>
  )
}