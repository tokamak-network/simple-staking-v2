import { Button, Checkbox, Flex, useTheme } from "@chakra-ui/react"
import ETH_SYMBOL from "@/assets/images/ETH-symbol.svg"
import TITAN_SYMBOL from '@/assets/images/symbol.svg'
import Arrow from '@/assets/images/right_arrow.svg'
import Image from "next/image"
import { UnstakeBalanceInput } from "./UnstakeBalanceInput"
import { useCallback, useState } from "react"
import useCallContract from "@/hooks/useCallContract"
import { convertToRay, floatParser } from "@/components/number"
import { StakeModalDataType } from "@/types"
import { useWeb3React } from "@web3-react/core"
import { useRecoilState } from "recoil"
import { inputState } from "@/atom/global/input"
import { txState } from "@/atom/global/transaction"

type ToTitanProps = {
  selectedModalData: StakeModalDataType
  closeThisModal: any
}

export const ToTitan = (args: ToTitanProps) => {
  const theme = useTheme();
  const { btnStyle } = theme;

  const { selectedModalData, closeThisModal } = args
  
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { account, library } = useWeb3React();
  const [input, setInput] = useRecoilState(inputState);
  const [, setTxPending] = useRecoilState(txState);
  const [tx, setTx] = useState();

  const { DepositManager_CONTRACT } =
    useCallContract();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(e.target.checked);

  const {
    stakedAmount
  } = selectedModalData

  const withdrawL2 = useCallback(async () => {
    const amount = floatParser(input);
    try {
      if (DepositManager_CONTRACT && amount && account && selectedModalData) {
        const tx = await DepositManager_CONTRACT.withdrawAndDepositL2(
          selectedModalData.layer2,
          convertToRay(amount.toString()),
        );
        setTx(tx);
        setTxPending(true);
        
        return closeThisModal();
      }
    } catch (e) {
      console.log(e)
    }
  }, [DepositManager_CONTRACT, closeThisModal, input, selectedModalData, setTx, setTxPending])

  return (
    <Flex flexDir={'column'}>
      <Flex
        h={'134px'}
        flexDir={'row'}
        justifyContent={'center'} 
        alignItems={'center'}
        fontSize={'12px'}
        fontWeight={'normal'}
        color={'#07070c'}
      >
        <Flex flexDir={'column'} alignItems={'center'}>
          <Flex 
            w={'40px'} 
            h={'40px'} 
            bgColor={'#383736'} 
            borderRadius={'100px'} 
            justifyContent={'center'} 
            alignItems={'center'}
          >
            <Image src={ETH_SYMBOL} alt={''} />
          </Flex>
          <Flex mt={'6px'}>
            Ethereum
          </Flex>
        </Flex>
        <Flex mx={'15px'} mb={'25px'}>
          <Image src={Arrow} alt={''} />
        </Flex>
        <Flex flexDir={'column'} alignItems={'center'}>
          <Flex 
            w={'40px'} 
            h={'40px'} 
            bgColor={'#383736'} 
            borderRadius={'100px'} 
            justifyContent={'center'} 
            alignItems={'center'}
          >
            <Image src={TITAN_SYMBOL} alt={''} />
          </Flex>
          <Flex mt={'6px'}>
            TITAN
          </Flex>
        </Flex>
      </Flex>
      <UnstakeBalanceInput 
        stakedAmount={stakedAmount}
      />
      <Flex w={'100%'} h={'1px'} my={'25px'} bgColor={'#f4f6f8'} />
      <Flex>
        <Checkbox 
          bgColor={'#e9edf1'} 
          borderRadius={'4px'} 
          border={'solid 1px #e7ebf2'} 
          w={'18px'}
          h={'18px'}
          onChange={handleCheckboxChange}
        />
        <Flex ml={'10px'} fontSize={'12px'} fontWeight={'normal'} color={'#3e495c'} w={'271px'}>
        Restaking unstaked TON earns you TON from staking. However, to withdraw, they need to be unstaked and wait for 93,046 blocks (~14 days).
        </Flex>
      </Flex>
      <Flex justifyContent={'center'}>
        <Button
          {...btnStyle.btnAble()}
          w={'130px'}
          h={'38px'}
          mt={'25px'}
          fontSize={'14px'}
          fontWeight={500}
          isDisabled={!isChecked}
          onClick={() => withdrawL2()}
        >
          Withdraw
        </Button>
      </Flex>
    </Flex>
  )
}