import { BalanceInput } from "@/common/input/CustomInput"
import { Button, Checkbox, Flex, useTheme } from "@chakra-ui/react"
import TON from "@/assets/images/ton.svg"
import Image from "next/image"
import { UnstakeBalanceInput } from "./UnstakeBalanceInput"
import { useCallback, useEffect, useMemo, useState } from "react"
import { convertToRay, floatParser } from "@/components/number"
import useCallContract from "@/hooks/useCallContract"
import { useWeb3React } from "@web3-react/core"
import { useRecoilState } from "recoil"
import { inputState } from "@/atom/global/input"
import { txHashStatus, txState } from "@/atom/global/transaction"
import { StakeModalDataType } from "@/types"
import { StakingCheckbox } from "@/common/checkbox/StakingCheckbox"
import WithdrawTable from "./WithdrawTable"
import { getModeData, transactionModalOpenStatus, transactionModalStatus } from "@/atom/global/modal"
import { LoadingDots } from "@/common/Loader/LoadingDots"
import { useWithdrawRequests } from "@/hooks/staking/useWithdrawable"

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
  const [txPending, setTxPending] = useRecoilState(txState);
  const [, setModalOpen] = useRecoilState(transactionModalStatus);
  const [, setIsOpen] = useRecoilState(transactionModalOpenStatus);
  const [selectedMode, setSelectedMode] = useRecoilState(getModeData);
  const [, setTxHash] = useRecoilState(txHashStatus)
  
  const [tx, setTx] = useState();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [requests, setRequests] = useState([])
  // const [disable, setDisable] = useState<boolean>(true);
  const { withdrawRequests } = useWithdrawRequests()

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(e.target.checked);

  const {
    stakedAmount
  } = selectedModalData

  const columns = useMemo(
    () => [
      {
        accessor: 'amount',
        Header: () => {
          return (
            <Flex>
              Amount
            </Flex>
          )
        },
      },
      {
        accessor: 'status',
        Header: 'Status',
      },
    ],
    [],
  )


  useEffect(() => {
    const fetch = async () => {
      if (selectedModalData) {
        //@ts-ignore
        const pendingRequests = await withdrawRequests(selectedModalData.layer2)
        
        setRequests(pendingRequests)
      }
    }
    fetch()
  }, [selectedModalData, txPending])

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

  const unStaking = useCallback(async () => {
    try {
      setSelectedMode('Unstake');
      setIsOpen(true)
      setModalOpen("waiting")

      const amount = floatParser(input);
      if (DepositManager_CONTRACT && SeigManager_CONTRACT && amount && account && selectedModalData) {
        const tx = await DepositManager_CONTRACT.requestWithdrawal(
          selectedModalData.layer2,
          convertToRay(amount.toString()),
        );
        setTx(tx); 
        setTxPending(true);
        setTxHash(tx.hash)
        
        setModalOpen("confirming")
        setInput('');
        setIsChecked(false)
      }
    } catch (e) {
      console.log(e);
      setModalOpen("error");
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
        isChecked={isChecked}
      />
      <Flex justifyContent={'center'} flexDir={'column'}>
        <Button
          {...btnStyle.btnAble()}
          w={'130px'}
          h={'38px'}
          my={'25px'}
          fontSize={'14px'}
          fontWeight={500}
          
          isDisabled={!isChecked || !floatParser(input)}
          onClick={() => unStaking()}
        >
          Unstake
        </Button>
        <Flex
          fontSize={'14px'}
          fontWeight={500}
          color={'#3e495c'}
          // w={'110px'}
          mb={'12px'}
        >
          Pending Withdrawal
        </Flex>
      </Flex>
      {
        requests && requests.length == 0 ?
        'No history'
        : requests && requests.length !== 0 ?
        <WithdrawTable 
          columns={columns}
          data={requests}
          toggle={selectedMode}
        /> : 
        <LoadingDots />
      }
    </Flex>
  )
}


