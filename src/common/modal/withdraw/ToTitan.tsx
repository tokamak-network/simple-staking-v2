import { Button, Checkbox, Flex, useTheme } from "@chakra-ui/react"
import TITAN_SYMBOL from '@/assets/images/symbol.svg'
import { UnstakeBalanceInput } from "./UnstakeBalanceInput"
import { useCallback, useEffect, useMemo, useState } from "react"
import useCallContract from "@/hooks/useCallContract"
import { convertToRay, floatParser } from "@/components/number"
import { StakeModalDataType } from "@/types"
import { useWeb3React } from "@web3-react/core"
import { useRecoilState } from "recoil"
import { inputState } from "@/atom/global/input"
import { txState } from "@/atom/global/transaction"
import { StakingCheckbox } from "@/common/checkbox/StakingCheckbox"
import WithdrawL2Table from "./WithdrawL2Table"
import { WithdrawL2Image } from "./WithdrawL2Image"
import useGetTransaction from "@/hooks/staking/useGetTransaction"

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
  const { DepositManager_CONTRACT } = useCallContract();
  const tData = useGetTransaction();

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

  const {
    stakedAmount
  } = selectedModalData
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  }

  useEffect(() => {
    async function waitReceipt() {
      if (tx && !tx['status']) {
        //@ts-ignore
        await tx.wait().then((receipt: any) => {
          if (receipt.status) {
            setTxPending(false);
            setTx(undefined);
          }
        });
      }
    }
    waitReceipt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx]);

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
        setInput('')
        setIsChecked(false)
        return closeThisModal();
      }
    } catch (e) {
      console.log(e)
    }
  }, [DepositManager_CONTRACT, input, selectedModalData, setTx, setTxPending])
  
  return (
    <Flex flexDir={'column'}>
      <WithdrawL2Image 
        l2Image={TITAN_SYMBOL}
      />
      <UnstakeBalanceInput 
        stakedAmount={stakedAmount}
      />
      <Flex w={'100%'} h={'1px'} my={'25px'} bgColor={'#f4f6f8'} />
      <StakingCheckbox 
        content={`TON withdrawals to L2 typically take 1–5 minutes or longer. If TON isn't credited on L2, contact the L2 operator directly.`}
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
          onClick={() => withdrawL2()}
        >
          Withdraw
        </Button>
      </Flex>
      {
        selectedModalData?.name === 'Titan-sepolia' ?
        <WithdrawL2Table 
          columns={columns}
          data={tData.depositTxs}
        /> : 
        <Flex 
          fontSize={'12px'}
          textAlign={'center'}
          mt={'25px'}
          fontWeight={400}
        >
          Withdraw history is not supported for this L2. Please check Etherscan and relevant L2 block explorer.
        </Flex>
      }
    </Flex>
  )
}