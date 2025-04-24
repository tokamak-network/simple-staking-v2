import { Button, Checkbox, Flex, useTheme } from "@chakra-ui/react"
import TITAN_SYMBOL from '@/assets/images/symbol.svg'
import { useCallback, useEffect, useMemo, useState } from "react"
import useCallContract from "@/hooks/useCallContract"
import { convertNumber, convertToRay, floatParser } from "@/components/number"
import { StakeModalDataType } from "@/types"
import { useWeb3React } from "@web3-react/core"
import { useRecoilState } from "recoil"
import { inputState } from "@/atom/global/input"
import { txState } from "@/atom/global/transaction"
import { StakingCheckbox } from "@/common/checkbox/StakingCheckbox"
import { useWithdrawalAndDeposited } from '@/hooks/staking/useWithdrawable';
import WithdrawL2Table from "../../../../common/modal/withdraw/WithdrawL2Table"
import { UnstakeBalanceInput } from '../../../../common/modal/withdraw/UnstakeBalanceInput';
import { WithdrawL2Image } from "../../../../common/modal/withdraw/WithdrawL2Image"


type MobileToL2Props = {
  selectedOp: any
  onClose: any
}

export function MobileToL2 (args: MobileToL2Props) {
  const theme = useTheme();
  const { btnStyle } = theme;

  const { selectedOp, onClose } = args
  
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { account, library } = useWeb3React();
  const [input, setInput] = useRecoilState(inputState);
  const [, setTxPending] = useRecoilState(txState);
  const [tx, setTx] = useState();
  const [withdrawTx, setWithdrawTx] = useState<any[]>([]);

  const { request } = useWithdrawalAndDeposited();

  const columns = useMemo(
    () => [
      {
        accessor: 'amount',
        Header: 'Amount'
      },
      {
        accessor: 'status',
        Header: 'Status'
      }
    ],
    []
  )
  
  useEffect(() => {
    async function fetch() {
      if (selectedOp) {
        const queryData = await request(selectedOp.candidateContract)
        console.log(queryData)
        setWithdrawTx(queryData)
      }
    }
    fetch()
  }, [])

  const { DepositManager_CONTRACT } = useCallContract();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(e.target.checked);

  
  const myStaked = selectedOp?.stakeOf ? convertNumber({
    amount: selectedOp?.stakeOf,
    type: 'ray',
    localeString: true
  }) : '0.00'

  const withdrawL2 = useCallback(async () => {
    const amount = floatParser(input);
    try {
      if (DepositManager_CONTRACT && amount && account && selectedOp) {
        const tx = await DepositManager_CONTRACT.withdrawAndDepositL2(
          selectedOp.candidateContract,
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
      console.log(e)
    }
  }, [DepositManager_CONTRACT, input, selectedOp, setTx, setTxPending])

  const close = () => {
    setInput('')
    onClose()
  }

  return (
    <Flex flexDir={'column'}>
      <WithdrawL2Image 
        l2Image={TITAN_SYMBOL}
        l2Name={selectedOp?.name}
      />
      <UnstakeBalanceInput 
        stakedAmount={myStaked ? myStaked : '0.00'}
      />
      <StakingCheckbox 
        content={'Restaking unstaked TON earns you TON from staking. However, to withdraw, they need to be unstaked and wait for 93,046 blocks (~14 days).'}
        handleCheckboxChange={handleCheckboxChange}
        isChecked={isChecked}
      />
      <Flex justifyContent={'center'}>
        <Button
          {...btnStyle.btnAble()}
          w={'100%'}
          h={'40px'}
          mt={'25px'}
          // mb={'15px'}
          fontSize={'14px'}
          fontWeight={500}
          isDisabled={!isChecked}
          onClick={() => withdrawL2()}
        >
          Withdraw
        </Button>
      </Flex>
      {
        withdrawTx && withdrawTx.length > 0 ?
        <WithdrawL2Table 
          columns={columns}
          data={withdrawTx}
        /> : ''
      }
    </Flex>
  )
}

export default MobileToL2