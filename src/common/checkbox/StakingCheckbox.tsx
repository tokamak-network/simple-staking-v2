import { useWindowDimensions } from "@/hooks/useWindowDimensions"
import { chakra, Checkbox, Flex, useCheckbox, Text, Box } from "@chakra-ui/react"
import Image from "next/image"
import TICK from '@/assets/images/Tick.svg'

type StakingCheckboxProps = {
  content: string
  handleCheckboxChange: any
  isChecked: boolean
}

export const StakingCheckbox = (args: StakingCheckboxProps) => {
  const { content, handleCheckboxChange, isChecked } = args
  
  const [width] = useWindowDimensions();
  const mobile = width && width < 1040;

  return (
    <Flex w={mobile ? '100%' : ''} mt={mobile ? '24px' : ''}>
      <Checkbox 
        isChecked={isChecked}
        bgColor={'#fff'} 
        borderRadius={'4px'} 
        border={'solid 1px #e7ebf2'} 
        w={'18px'}
        h={'18px'}
        mt={'5px'}
        onChange={handleCheckboxChange}
      />
      <Flex ml={'10px'} fontSize={'12px'} fontWeight={'normal'} color={'#3e495c'} w={mobile ? '90%' : '271px'}>
        {content}
      </Flex>
    </Flex>
  )
}

// export const StakingCheckbox = (props: StakingCheckboxProps) => {
//   const { content, handleCheckboxChange } = props

//   const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } =
//       useCheckbox()
//   const [width] = useWindowDimensions();
//   const mobile = width && width < 1040;

//   return (
//     <Flex w={mobile ? '100%' : ''} mt={mobile ? '24px' : ''}>
//       <chakra.label
//         display='flex'
//         flexDirection='row'
//         alignItems='center'
//         gridColumnGap={2}
//         maxW='320px'
        
//         px={3}
//         py={1}
//         cursor='pointer'
//         {...htmlProps}
//       >
//         <input {...getInputProps()} hidden />
//         <Flex
//           alignItems='start'
//           justifyContent='center'
//           border='2px solid'
//           borderColor='gray.100'
//           w={'18px'}
//           h={'18px'}
//           {...getCheckboxProps()}
//         >
//           {state.isChecked && <Flex w={"18px"} h={'18px'} bg='#2a72e5' justifyContent={'center'} alignItems={'center'} ><Image src={TICK} alt={''}/></Flex>}
//         </Flex>
//         <Text w={'296px'} fontSize={'12px'} color='gray.700' {...getLabelProps()}>
//           {content}
//         </Text>
//       </chakra.label>
//     </Flex>
//   )
// }