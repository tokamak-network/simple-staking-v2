import { Button, Checkbox, Flex, useTheme } from "@chakra-ui/react"

import { useCallback, useState } from "react"
import { convertNumber, convertToRay, floatParser } from "@/components/number"
import useCallContract from "@/hooks/useCallContract"
import { useWeb3React } from "@web3-react/core"
import { useRecoilState } from "recoil"
import { inputState } from "@/atom/global/input"
import { txState } from "@/atom/global/transaction"
import { StakingCheckbox } from "@/common/checkbox/StakingCheckbox"
import { UnstakeBalanceInput } from "../../../../common/modal/withdraw/UnstakeBalanceInput"

type MobileUnstakeProps = {
  selectedOp: any
  onClose: any
}

export function MobileUnstake (args: MobileUnstakeProps) {
  const { selectedOp, onClose } = args
  const theme = useTheme();
  const { btnStyle } = theme;
  const { DepositManager_CONTRACT, SeigManager_CONTRACT } =
    useCallContract();
  
  const { account } = useWeb3React();
  const [input, setInput] = useRecoilState(inputState);
  const [, setTxPending] = useRecoilState(txState);
  const [tx, setTx] = useState();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(e.target.checked);

  // const {
  //   stakeOf
  // } = selectedOp

  const unStaking = useCallback(async () => {
    try {
      const amount = floatParser(input);
      if (DepositManager_CONTRACT && SeigManager_CONTRACT && amount && account && selectedOp) {
        const tx = await DepositManager_CONTRACT.requestWithdrawal(
          selectedOp?.candidateContract,
          convertToRay(amount.toString()),
        );
        setTx(tx);
        setTxPending(true);
        close()

        if (tx) {
          await tx.wait().then((receipt: any) => {
            if (receipt.status) {
              setTxPending(false);
              setTx(undefined);
            }
          });
        }
      }
    } catch (e) {
      console.log(e);
      setTxPending(false);
      setTx(undefined);
    }
  }, [DepositManager_CONTRACT, input, setTx, setTxPending]);

  const close = () => {
    setInput('')
    onClose()
  }

  const myStaked = selectedOp?.stakeOf ? convertNumber({
    amount: selectedOp?.stakeOf,
    type: 'ray',
    localeString: true
  }) : '0.00'

  return (
    <Flex 
      flexDir={'column'} 
      w={'100%'} 
      h={'100%'} 
      alignItems={'space-between'} 
      justifyContent={'space-between'}
    >
      <Flex flexDir={'column'}>
        <UnstakeBalanceInput 
          stakedAmount={myStaked ? myStaked : '0.00'}
        />
        <StakingCheckbox 
          content={'To withdraw staked TON, it needs to be unstaked first and after 93,046 blocks (~14 days) they can be withdrawn to your account.'}
          handleCheckboxChange={handleCheckboxChange}
        />
      </Flex>
      <Flex justifyContent={'center'}>
        <Button
          {...btnStyle.btnAble()}
          w={'100%'}
          h={'40px'}
          mt={'25px'}
          mb={'15px'}
          fontSize={'14px'}
          fontWeight={500}
          isDisabled={!isChecked}
          onClick={() => {
            unStaking()
          }}
        >
          Unstake
        </Button>
      </Flex>
    </Flex>
  )
}

export default MobileUnstake