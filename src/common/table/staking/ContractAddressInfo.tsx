import {
  Tooltip,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LIST from '@/assets/images/list.svg'
import Image from 'next/image';
import { L1ContractInfo } from "./L1ContractInfo";
import CLOSE from '@/assets/images/popup_close_s_icon.svg'

type tooltipProps = {
  label: any;
  tab?: any;
};

const ContractAddressInfo: React.FC<tooltipProps> = (props) => {
  const { label, tab } = props;
  const [isLabelOpen, setIsLabelOpen] = useState(false)
  const tooltipControl = () => {
    !isLabelOpen ? setIsLabelOpen(true) : setIsLabelOpen(false)
  }
  useEffect(() => {
    setIsLabelOpen(false)
  }, [tab])

  const core = [
    {
      title: 'DAO',
      content: '',
    },
    {
      title: 'Seigniorage',
      content: '',
    },
    {
      title: 'Staking',
      content: '',
    },
  ]

  const candidate = [
    {
      title: 'DAO candidate',
      content: '',
    },
    {
      title: 'DAO candidate manager',
      content: '',
    },
  ]

  const l2Info = [
    {
      title: 'L2 registry',
      content: '',
    },
    {
      title: 'Sequencer signiorage manager',
      content: '',
    },
    {
      title: 'Rollup config',
      content: '',
    },
    {
      title: 'L1 TON bridge',
      content: '',
    },
  ]
  
  return (
    <Tooltip
      display={label?.length === 0 ? "none" : "flex"}
      placement={"bottom"}
      pointerEvents={"all"}
      label={
        <Flex 
          flexDir={'row'}
          justifyContent={'space-between'}
          // h={'212px'}
          w={'420px'}
          px={'0px'}
          mx={'0px'}
          mr={'10px'}
        >
          {
            <Flex
              flexDir={'column'}
              w={'210px'}  
            >
              <Flex
                alignItems={'center'}
                h={'45px'}
                fontWeight={600}
                fontSize={'12px'}
                color={'#3d495d'}
                p={'15px'}
                borderBottom={'1px solid #f4f6f8'}
              >
                Core
              </Flex>
              {
                core.map((info: any, index: number) => {
                  return (
                    <L1ContractInfo 
                      title={info.title}
                      content={info.content}
                    />
                  )
                })
              }
            </Flex>
          }
          {
            <Flex
              flexDir={'column'}
              w={'210px'}
              borderLeft={'1px solid #f4f6f8'}
              borderRight={label ? '1px solid #f4f6f8' : ''}
            >
              <Flex
                alignItems={'center'}
                h={'45px'}
                fontWeight={600}
                fontSize={'12px'}
                color={'#3d495d'}
                p={'15px'}
                
                borderBottom={'1px solid #f4f6f8'}
              >
                <Flex>
                  DAO candidate
                </Flex>
                {
                  tab === 'staking' ?
                  <Flex 
                    justifyContent={'start'} 
                    alignItems={'start'} 
                    // mt={'15px'}
                    cursor={'pointer'}
                    onClick={() => setIsLabelOpen(false)}
                    position={'absolute'}
                    right={'15px'}
                    top={'15px'}
                  >
                    <Image src={CLOSE} alt={''} />
                  </Flex>  : ''
                }
              </Flex>
              {
                candidate.map((info: any, index: number) => {
                  return (
                    <L1ContractInfo 
                      title={info.title}
                      content={info.content}
                    />
                  )
                })
              }
            </Flex>
          }
          {
            label ?
            <Flex
              flexDir={'column'}
            >
              <Flex
                alignItems={'center'}
                h={'45px'}
                fontWeight={600}
                fontSize={'12px'}
                color={'#3d495d'}
                p={'15px'}
                borderBottom={'1px solid #f4f6f8'}
              >
                <Flex>
                  L2 info
                </Flex>
                <Flex 
                  justifyContent={'start'} 
                  alignItems={'start'} 
                  // mt={'15px'}
                  cursor={'pointer'}
                  onClick={() => setIsLabelOpen(false)}
                  position={'absolute'}
                  right={'15px'}
                  top={'15px'}
                >
                  <Image src={CLOSE} alt={''} />
                </Flex> 
              </Flex>
              {
                l2Info.map((info: any, index: number) => {
                  return (
                    <L1ContractInfo 
                      title={info.title}
                      content={info.content}
                    />
                  )
                })
              }
            </Flex> : ''
          }
        </Flex>
      }
      bg={"#fff"}
      borderRadius={"15px"}
      color={"#3d495c"}
      fontSize="16px"
      // h={'210px'}
      // maxW={'210px'}
      minW={label ? '630px' : '420px'}
      mr={label ? '500px' : '390px'}
      px={'0px'}
      bgColor={'#fff'}
      boxShadow={'0 2px 6px 0 rgba(61, 73, 93, 0.1)'}
      isOpen={isLabelOpen}
      border={'0px'}
    >
      <Flex
        display={label?.length === 0 ? "none" : ""}
        h={"20px"}
        w={"20px"}
        color={'#333'}
        cursor={'pointer'}
        onClick={() => tooltipControl()}
      >
        <Image src={LIST} alt={''} />
      </Flex>
    </Tooltip>
  );
};

export default ContractAddressInfo;
