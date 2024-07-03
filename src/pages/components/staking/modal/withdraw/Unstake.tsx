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
  closeThisModal: any
}

export const Unstake = (args: UnstakeProps) => {
  const { selectedModalData, closeThisModal } = args
  const theme = useTheme();
  const { btnStyle } = theme;
  const { TON_CONTRACT, WTON_CONTRACT, Old_DepositManager_CONTRACT, DepositManager_CONTRACT, SeigManager_CONTRACT } =
    useCallContract();
  
  const { account, library } = useWeb3React();
  const [input, setInput] = useRecoilState(inputState);
  const [, setTxPending] = useRecoilState(txState);
  const [tx, setTx] = useState();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(e.target.checked);

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
        
        const tx = await DepositManager_CONTRACT.requestWithdrawal(
          selectedModalData.layer2,
          convertToRay(amount.toString()),
        );
        setTx(tx);
        setTxPending(true);
        
        return closeThisModal();
      }
    } catch (e) {
      console.log(e);
    }
  }, [DepositManager_CONTRACT, input, selectedModalData, setTx, setTxPending]);

  return (
    <Flex flexDir={'column'} w={'350px'} alignItems={'center'}>
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
        To withdraw staked TON, it needs to be unstaked first and after 93,046 blocks (~14 days) they can be withdrawn to your account.
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
          onClick={() => unStaking()}
        >
          Unstake
        </Button>
      </Flex>
    </Flex>
  )
}