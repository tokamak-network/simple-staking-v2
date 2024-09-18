
import { Button, Flex, Link } from "@chakra-ui/react"
import trimAddress from '../../../utils/trimAddress';
import NEWTAB from '@/assets/images/newtab-icon.png'
import Image from "next/image";
import { useCallback, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { getContract } from "@/components/getContract";
import CandidateAddOn from 'services/abi/CandidateAddOn.json'
import { useRecoilState } from "recoil";
import { txState } from "@/atom/global/transaction";
import ETHERSCAN_LINK_Image from '@/assets/images/etherscan_link_icon.png';
import { ETHERSCAN_LINK } from "@/constants";
import CONTRACT_ADDRESS from "@/services/addresses/contract";


type L2ContentProps = {
  title: string;
  content: string | undefined;
  type: string;
  contractAddress? : string;
  content2?: string | undefined;
  modalButton?: any;
  dataModal?: any;
}

export function L2Content (args: L2ContentProps) {
  const {
    title,
    content,
    type,
    contractAddress,
    content2,
    modalButton,
    dataModal
  } = args
  
  const { library, account } = useWeb3React()
  const [tx, setTx] = useState();
  const [, setTxPending] = useRecoilState(txState);


  const updateSeig = useCallback(async (type: number) => {
    if (account && library && contractAddress) {
      try {
        console.log(contractAddress)
        const Candidate_CONTRACT = getContract(contractAddress, CandidateAddOn, library, account)
        console.log(await Candidate_CONTRACT.operator())
        
        const tx = await Candidate_CONTRACT.updateSeigniorage(type)
        setTx(tx);
        setTxPending(true);
      } catch (e) {
        console.log(e)
        setTxPending(false);
        setTx(undefined);
      }
    }
  }, [])

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
      w={'250px'}
    >
      <Flex
        fontSize={'13px'}
        color={'#808992'}
        mb={'8px'}
      >
        <Flex>
          {title}
        </Flex>
        {
          type === 'ton' ?
          <Link 
            w={'20px'} 
            height={'20px'} 
            justifyContent={'center'} 
            alignItems={'center'}
            ml={'6px'}
            href={`${ETHERSCAN_LINK}/address/${CONTRACT_ADDRESS.TON_ADDRESS}#readContract#F2`}
            isExternal
          >
            <Image src={ETHERSCAN_LINK_Image} alt={'alt'} />
          </Link> : ''
        }
      </Flex>
      <Flex
        fontSize={'20px'}
        color={'#304156'}
      >
        {
          type === 'ton' ?
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
          </Flex> : 
          type === 'seig' ?
          <Flex
            flexDir={'row'}
          >
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
            <Flex 
              color={'#C7D1D8'}
              fontSize={'20px'}
              mx={'6px'}
              fontWeight={400}
            >
              /
            </Flex>
            <Flex
              fontWeight={'bold'}
            >
              {content2}
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
       
      </Flex>      
    </Flex>
  )
}

export default L2Content
