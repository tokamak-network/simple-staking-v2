import { Box, Flex } from "@chakra-ui/react"

export const getCircle = (kind: string) => {
  return (
    <Flex alignContent={'center'} alignItems={'center'} mr={'10px'}>
      {kind === 'layer2' ? (
        <Flex flexDir={'column'}>
          <Box
            w={'8px'}
            h={'8px'}
            borderRadius={50}
            bg={'#eb597b'}
            mb={'4px'}
          />
          <Box
            w={'8px'}
            h={'8px'}
            borderRadius={50}
            bg={'#00c766'}
          />
        </Flex>
      ) : (
        <Box
          w={'8px'}
          h={'8px'}
          borderRadius={50}
          bg={
            kind === 'candidate'
              ? '#eb597b'
              : '#00c766'  
          } 
        />
      )}
    </Flex>
  )
}

export default getCircle