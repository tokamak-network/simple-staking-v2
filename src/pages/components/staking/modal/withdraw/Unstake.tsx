import { BalanceInput } from "@/common/input/CustomInput"
import { Button, Checkbox, Flex, useTheme } from "@chakra-ui/react"
import TON from "@/assets/images/ton.svg"
import Image from "next/image"
import { UnstakeBalanceInput } from "./UnstakeBalanceInput"
import { useCallback, useState } from "react"
import { convertToRay, floatParser } from "@/components/number"
import useCallContract from "@/hooks/useCallContract"
import { useWeb3React } from "@web3-react/core"
import { useRecoilState } from "recoil"
import { inputState } from "@/atom/global/input"
import { txState } from "@/atom/global/transaction"
import { StakeModalDataType } from "@/types"

type UnstakeProps = {
  selectedModalData: StakeModalDataType
}

export const Unstake = (args: UnstakeProps) => {
  const { selectedModalData } = args
  const theme = useTheme();
  const { btnStyle } = theme;
  const { TON_CONTRACT, WTON_CONTRACT, Old_DepositManager_CONTRACT, DepositManager_CONTRACT, SeigManager_CONTRACT } =
    useCallContract();
  
  const { account, library } = useWeb3React();
  const [input, setInput] = useRecoilState(inputState);
  const [, setTxPending] = useRecoilState(txState);
  const [tx, setTx] = useState();

  const {
    stakedAmount
  } = selectedModalData

  const unStaking = useCallback(async () => {
    try {
      const amount = floatParser(input);
      if (DepositManager_CONTRACT && SeigManager_CONTRACT && amount && account && selectedModalData) {
        
        // const coinage = getContract(await SeigManager_CONTRACT.coinages(selectedModalData.layer2), Coinage, library, account)
        // const bal = await coinage.balanceOf(account)
        // console.log(bal.toString(), convertToRay(amount.toString()))
        // operator 일 경우 minimum amount 남겨둬야함
        if (
          confirm(
            `Warning:\nYou may lose unclaimed staking reward if you unstake before claiming them.\nCome back after 93,046 blocks (~14 days) from unstaking to withdraw (W)TON to your account.`,
          )
        ) {
          const tx = await DepositManager_CONTRACT.requestWithdrawal(
            
            selectedModalData.layer2,
            convertToRay(amount.toString()),
          );
          setTx(tx);
          setTxPending(true);
        }
        // return closeThisModal();
      }
    } catch (e) {
      console.log(e);
    }
  }, [DepositManager_CONTRACT, input, selectedModalData, setTx, setTxPending]);
  // console.log(selectedModalData)

  return (
    <Flex flexDir={'column'} w={'350px'} alignItems={'center'}>
      <UnstakeBalanceInput 
        stakedAmount={stakedAmount}
      />
      <Flex w={'100%'} h={'1px'} my={'25px'} bgColor={'#f4f6f8'} />
      <Flex>
        <Checkbox />
        <Flex ml={'10px'} fontSize={'12px'} fontWeight={'normal'} color={'#3e495c'} w={'271px'}>
          Donec quam lectus vel vulputate mauris. Nullam quam amet adipiscing quis diam nisl maecenas. Ornare fermentum ullamcorper ut ullamcorper amet. Amet et ut posuere.
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
          onClick={() => unStaking()}
        >
          Unstake
        </Button>
      </Flex>
    </Flex>
  )
}