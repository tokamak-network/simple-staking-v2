
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
import ETHERSCAN_LINK from '@/assets/images/etherscan_link_icon.png'


type L2ContentProps = {
  title: string;
  content: string | undefined;
  type: string;
  contractAddress? : string;
  content2?: string | undefined;
}

export function L2Content (args: L2ContentProps) {
  const {
    title,
    content,
    type,
    contractAddress,
    content2,
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
        {title}
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
        {
          title === 'Earned seigniorage' && account ?
          <Flex 
            ml={'6px'} 
            justifyContent={'space-between'} 
            w={'180px'}
          >
            <Button
              w={'80px'}
              h={'25px'}
              borderRadius={'4px'}
              border={'solid 1px #dfe4ee'}
              bgColor={'#fff'}
              color={'#86929d'}
              fontSize={'12px'}
              fontWeight={'normal'}
              _hover={{
                borderColor: '#2a72e5',
                color: '#2a72e5'
              }}
              onClick={()=> { updateSeig(1)}}
            >
              Claim
            </Button>
            <Button
              w={'80px'}
              h={'25px'}
              ml={'6px'}
              borderRadius={'4px'}
              border={'solid 1px #dfe4ee'}
              bgColor={'#fff'}
              color={'#86929d'}
              fontSize={'12px'}
              fontWeight={'normal'}
              _hover={{
                borderColor: '#2a72e5',
                color: '#2a72e5'
              }}
              onClick={()=> { updateSeig(2)}}
            >
              Stake
            </Button>
          </Flex> : ''
        }
      </Flex>      
    </Flex>
  )
}

export default L2Content
