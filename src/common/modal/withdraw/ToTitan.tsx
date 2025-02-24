import { Button, Checkbox, Flex, useTheme } from "@chakra-ui/react"
import TITAN_SYMBOL from '@/assets/images/symbol.svg'
import { UnstakeBalanceInput } from "./UnstakeBalanceInput"
import { useCallback, useEffect, useMemo, useState } from "react"
import useCallContract from "@/hooks/useCallContract"
import { convertToRay, floatParser } from "@/components/number"
import { StakeModalDataType } from "@/types"
import { useWeb3React } from "@web3-react/core"
import { useRecoilState, useRecoilValue } from "recoil"
import { inputState } from "@/atom/global/input"
import { txHashStatus, txState } from "@/atom/global/transaction"
import { StakingCheckbox } from "@/common/checkbox/StakingCheckbox"
import WithdrawL2Table from "./WithdrawL2Table"
import { WithdrawL2Image } from "./WithdrawL2Image"
import { getModeData, transactionModalOpenStatus, transactionModalStatus } from "@/atom/global/modal"
import NoLOGO from '@/assets/images/modal/gallery.svg'
import { useIsOperator } from "@/hooks/staking/useIsOperator"
import { useWithdrawalAndDeposited } from "@/hooks/staking/useWithdrawable"
import { LoadingDots } from "@/common/Loader/LoadingDots"
import L2Info from '../../../../l2_info.json'

type ToTitanProps = {
  selectedModalData: StakeModalDataType
  closeThisModal: any
}

export const ToTitan = (args: ToTitanProps) => {
  const theme = useTheme();
  const { btnStyle } = theme;

  const { selectedModalData, closeThisModal } = args
  
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [withdrawTx, setWithdrawTx] = useState<any[]>([]);
  const { account, library } = useWeb3React();
  const [input, setInput] = useRecoilState(inputState);
  const [txPending, setTxPending] = useRecoilState(txState);
  const [, setModalOpen] = useRecoilState(transactionModalStatus);
  const [, setIsOpen] = useRecoilState(transactionModalOpenStatus);
  const [, setSelectedMode] = useRecoilState(getModeData);
  const [, setTxHash] = useRecoilState(txHashStatus)
  
  const [tx, setTx] = useState();
  const { DepositManager_CONTRACT } = useCallContract();
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

  const {
    stakedAmount
  } = selectedModalData
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  }

  const [logo, setLogoValue] = useState<string>('')

  useEffect(() => {
    if (selectedModalData) {
      const infos = L2Info.find((info: any) => info.candidate === selectedModalData.candidate)
    
      if (infos) {
        setLogoValue(infos.logo)
      }
    }
  }, [L2Info, selectedModalData])

  useEffect(() => {
    async function waitReceipt() {
      if (tx && !tx['status']) {
        //@ts-ignore
        await tx.wait().then((receipt: any) => {
          if (receipt.status) {
            setModalOpen("confirmed")
            setTxPending(false);
            setTx(undefined);
          }
        });
      }
    }
    waitReceipt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx]);

  useEffect(() => {
    async function fetch() {
      if (selectedModalData) {
        const queryData = await request(selectedModalData.layer2)
        setWithdrawTx(queryData)
      }
    }
    fetch()
  }, [selectedModalData, txPending])

  const withdrawL2 = useCallback(async () => {
    const amount = floatParser(input);
    try {
      if (DepositManager_CONTRACT && amount && account && selectedModalData) {
        setSelectedMode(`Withdraw To ${selectedModalData.name}`);
        setIsOpen(true)
        setModalOpen("waiting")

        const tx = await DepositManager_CONTRACT.withdrawAndDepositL2(
          selectedModalData.layer2,
          convertToRay(amount.toString()),
        );
        setTx(tx);
        setTxPending(true);
        setTxHash(tx.hash)
       
        setModalOpen("confirming")
        setInput('')
        setIsChecked(false)
        // return closeThisModal();
      }
    } catch (e) {
      console.log(e)
      setModalOpen("error")
    }
  }, [DepositManager_CONTRACT, input, selectedModalData, setTx, setTxPending])
  
  return (
    <Flex flexDir={'column'}>
      <WithdrawL2Image 
        l2Image={logo ? logo : NoLOGO.src}
        l2Name={selectedModalData?.name}
      />
      <UnstakeBalanceInput 
        stakedAmount={stakedAmount}
      />
      <Flex w={'100%'} h={'1px'} my={'25px'} bgColor={'#f4f6f8'} />
      <StakingCheckbox 
        content={`TON withdrawals to L2 typically take 1–5 minutes or longer. If TON isn't credited on L2, contact the L2 operator directly.`}
        handleCheckboxChange={handleCheckboxChange}
        isChecked={isChecked}
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
        withdrawTx && withdrawTx.length > 0 ?
        <WithdrawL2Table 
          columns={columns}
          // data={tData.depositTxs}
          data={withdrawTx}
        /> : 
        <Flex 
          fontSize={'12px'}
          justifyContent={'center'}
          mt={'25px'}
          fontWeight={400}
        >
          <LoadingDots />
        </Flex>
      }
    </Flex>
  )
}