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
import { StakingCheckbox } from "@/common/checkbox/StakingCheckbox"

type UnstakeProps = {
  selectedModalData: StakeModalDataType
  closeThisModal: any
}

export const Unstake = (args: UnstakeProps) => {
  const { selectedModalData, closeThisModal } = args
  const theme = useTheme();
  const { btnStyle } = theme;
  const { DepositManager_CONTRACT, SeigManager_CONTRACT } =
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
      <StakingCheckbox 
        content={'To withdraw staked TON, it needs to be unstaked first and after 93,046 blocks (~14 days) they can be withdrawn to your account.'}
        handleCheckboxChange={handleCheckboxChange}
      />
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