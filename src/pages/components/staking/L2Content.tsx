
import { Button, Flex, Link } from "@chakra-ui/react"
import trimAddress from '../../../utils/trimAddress';
import NEWTAB from '@/assets/images/newtab-icon.png'
import Image from "next/image";
import { useCallback, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { getContract } from "@/components/getContract";
import Layer2Candidate from 'services/abi/Layer2Candidate.json'
import { useRecoilState } from "recoil";
import { txState } from "@/atom/global/transaction";


type L2ContentProps = {
  title: string;
  content: string | undefined;
  type: string;
  contractAddress? : string;
}

export function L2Content (args: L2ContentProps) {
  const {
    title,
    content,
    type,
    contractAddress
  } = args
  
  const { library, account } = useWeb3React()
  const [tx, setTx] = useState();
  const [, setTxPending] = useRecoilState(txState);


  const updateSeig = useCallback(async () => {
    if (account && library && contractAddress) {
      try {
        console.log(contractAddress)
        const Candidate_CONTRACT = getContract(contractAddress, Layer2Candidate, library, account)
        console.log(Candidate_CONTRACT)
        const tx = await Candidate_CONTRACT.updateSeigniorage(1)
        setTx(tx);
        setTxPending(true);
      } catch (e) {
        console.log(e)
        setTxPending(false);
        setTx(undefined);
      }
    }
  }, [])

  const convert = type === 'address' ? trimAddress({
    address: content ? content : '',
    firstChar: 6,
    lastChar: 4,
    dots: '...'
  }) : content

  return (
    <Flex
      flexDir={'column'}
      fontWeight={500}
      textAlign={'left'}
      w={type === 'link' ? '100%' : '250px'}
      mr={type === 'link' ? '20px' : ''}
    >
      <Flex
        fontSize={'13px'}
        color={'#808992'}
        mb={'8px'}
      >
        {title}
      </Flex>
      <Flex
        fontSize={type === 'link' ? '14px' : '20px'}
        color={'#304156'}
      >
        <Flex 
          fontWeight={type === 'ton' ? 'bold' : 500}
          // w={'100%'}
        >
          {convert}
        </Flex>
        {
          type === 'ton' ?
          <Flex 
            fontSize={'13px'}
            fontWeight={500}
            ml={'4px'}
            alignItems={'end'}
            mb={'2px'}
          >
            TON
          </Flex> : ''
        }
        {
          type === 'address' || type === 'link' ?
          <Link 
            w={'20px'} 
            height={'20px'} 
            justifyContent={'center'} 
            alignItems={'center'}
            ml={'6px'}
            href={convert}
            isExternal
          >
            <Image src={NEWTAB} alt={''} /> 
          </Link> : ''
        }
        {
          title === 'Earned seigniorage' && account ?
          <Flex ml={'6px'}>
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
              onClick={()=> { updateSeig()}}
            >
              Claim
            </Button>
          </Flex> : ''
        }
      </Flex>      
    </Flex>
  )
}

export default L2Content
