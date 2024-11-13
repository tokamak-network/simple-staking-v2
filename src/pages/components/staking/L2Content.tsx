
import { Button, Flex, Link } from "@chakra-ui/react"
import trimAddress from '../../../utils/trimAddress';
import NEWTAB from '@/assets/images/newtab-icon.png'
import Image from "next/image";
import { useCallback, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useRecoilState } from "recoil";
import { txState } from "@/atom/global/transaction";
import ETHERSCAN_LINK_Image from '@/assets/images/etherscan_link_icon.png';
import { ETHERSCAN_LINK } from "@/constants";
import CONTRACT_ADDRESS from "@/services/addresses/contract";
import BasicTooltip from "@/common/tooltip";
import RIGHT_ARROW from "@/assets/images/right-arrow.png"


type L2ContentProps = {
  title: string;
  content: string | undefined;
  type: string;
  contractAddress? : string;
  content2?: string | undefined;
  isOperator?: any;
}

export function L2Content (args: L2ContentProps) {
  const {
    title,
    content,
    type,
    contractAddress,
    content2,
    isOperator
  } = args
  
  const { library, account } = useWeb3React()
  const [tx, setTx] = useState();
  const [, setTxPending] = useRecoilState(txState);

  const convert = type === 'address' 
    ? trimAddress({
      address: content ? content : '',
      firstChar: 6,
      lastChar: 4,
      dots: '...'
    }) 
    : content
    
  return (
    <Flex
      flexDir={'column'}
      fontWeight={500}
      textAlign={'left'}
      w={type === 'seig' ? '' : '250px'}
    >
      <Flex
        fontSize={'12px'}
        color={'#808992'}
        mb={'8px'}
      >
        <Flex>
          {title}
        </Flex>
        {
          type === 'ton' ?
          <Flex>
            <Flex marginTop={'4px'} marginLeft={'3px'}>
              <BasicTooltip 
                label={'a'}
              />
            </Flex>
            <Link 
              w={'20px'} 
              height={'20px'} 
              justifyContent={'center'} 
              alignItems={'center'}
              ml={'3px'}
              href={`${ETHERSCAN_LINK}/token/${CONTRACT_ADDRESS.TON_ADDRESS}?a=${content2}`}
              isExternal
            >
              <Image src={ETHERSCAN_LINK_Image} alt={'alt'} />
            </Link> 
          </Flex>
          : ''
        }
      </Flex>
      <Flex
        fontSize={'20px'}
        color={'#304156'}
      >
        {
          type === 'ton' ?
          <Flex>
            {
              isOperator ?
              <Flex>
                <Flex fontWeight={'bold'}>
                  100.00
                  <Flex 
                    fontSize={'13px'}
                    fontWeight={500}
                    ml={'4px'}
                    alignItems={'end'}
                    mb={'2px'}
                  >
                    TON
                  </Flex> 
                </Flex>
                <Flex w={'20px'} h={'20px'} mx={'5px'} mt={'5px'}>
                  <Image src={RIGHT_ARROW} alt={''} />
                </Flex>
              </Flex>
              : ''
            }
            <Flex
              fontWeight={'bold'}
            >
              {convert}
            </Flex>
            <Flex 
              fontSize={'13px'}
              fontWeight={500}
              ml={'4px'}
              alignItems={'end'}
              mb={'2px'}
            >
              TON
            </Flex> 
          </Flex> : 
          type === 'seig' ?
          <Flex
            flexDir={'row'}
          >
            {
              isOperator ?
              <Flex>
                <Flex
                  fontWeight={'bold'}
                >
                  {convert}
                </Flex>
                <Flex 
                  fontSize={'13px'}
                  fontWeight={500}
                  ml={'4px'}
                  alignItems={'end'}
                  mb={'2px'}
                >
                  TON
                </Flex> 
                
              </Flex> : ''
            }
          </Flex> : '' 
        }
       
      </Flex>      
    </Flex>
  )
}

export default L2Content
