import { 
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  useTheme,
  useCheckboxGroup, 
} from "@chakra-ui/react"
import {useCallback, useEffect, useMemo, useState} from 'react';
import { StakeModalDataType } from '../../../types/index';
import WithdrawTable from "./WithdrawTable";
import { TokenSelector } from "@/common/menulist/TokenSelector";
import { StakingCheckbox } from "@/common/checkbox/StakingCheckbox";
import useCallContract from "@/hooks/useCallContract";
import { useWeb3React } from "@web3-react/core";
import { useRecoilState } from "recoil";
import { txState } from "@/atom/global/transaction";
import { arraysEqual, findMax, range } from "@/components/array";

type WithdrawToEthereumProps ={
  selectedModalData: StakeModalDataType
  requests: any
  closeThisModal: any
}

export const WithdrawToEthereum = (args: WithdrawToEthereumProps) => {
  const {selectedModalData, requests, closeThisModal} = args
  const theme = useTheme();
  const { btnStyle } = theme;
  const [toggle, setToggle] = useState('Withdraw')
  const [option, setOption] = useState('WTON')

  const { 
    DepositManager_CONTRACT, 
  } = useCallContract();

  const { account } = useWeb3React();
  const [, setTxPending] = useRecoilState(txState);
  const [tx, setTx] = useState();
  const [arrLength, setArrLength] = useState(0);

  const [menuState, setMenuState] = useState(false);
  useEffect(() => {
    setMenuState(false);
  }, [])

  const { value, setValue, getCheckboxProps, isDisabled } = useCheckboxGroup()
  const [isChecked, setIsChecked] = useState<boolean>(true);
  

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(e.target.checked);

  useEffect(() => {
    let isMounted = true;
    let maxIndex = 0
    async function fetch() {
      if (DepositManager_CONTRACT) {
        let requestIndex = await DepositManager_CONTRACT.withdrawalRequestIndex(selectedModalData.layer2, account)
        if (isMounted) {
          if (value.includes('a')) return;
          maxIndex = findMax(value);
          const fillRange = range(+requestIndex.toString(), maxIndex);
          if (!arraysEqual(fillRange, value)) {
            setValue(fillRange);
          }
        }
      }
    }
    fetch()
    return () => {
      isMounted = false;
    };
  }, [value])

  useEffect(() => {
    value.includes('a') 
      ? setArrLength(value.length - 1) 
      : setArrLength(value.length)
    if (value.includes('a') && arrLength === 1) setValue([])
  }, [value])
  
  const options = ['WTON', 'TON']

  const handleToggle = useCallback(() => {
    setIsChecked(false)
    setToggle('Restake')
  },[]) 

  
  const handleSetOption = useCallback((option: any) => {
    setOption(option)
    setMenuState(false)
  }, [])

  const columns = useMemo(
    () => [
      {
        accessor: 'checkbox',
        Header: (props: any) => {
          return (
            <Flex>
              <Checkbox {...props()} />
            </Flex>
          )
        },
      },
      {
        accessor: 'amount',
        Header: () => {
          return (
            <Flex>
              Amount
              <Flex color={'#2a72e5'}>
                TON
              </Flex>
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

  const reStaking = useCallback(async () => {
    try {
      if (DepositManager_CONTRACT && account && selectedModalData && arrLength !== 0) {
        console.log(arrLength)
        const tx = await DepositManager_CONTRACT.redepositMulti(selectedModalData.layer2, arrLength);
        setTx(tx);
        setTxPending(true);

        return closeThisModal();
      }
    } catch (e) {
      console.log(e);
    }
  }, [arrLength, DepositManager_CONTRACT, account, selectedModalData, setTxPending, closeThisModal]);

  const withdraw = useCallback(async () => {
    try {
      if (selectedModalData && DepositManager_CONTRACT && selectedModalData) {
        const tx =
            selectedModalData.withdrawableLength === '0' 
            ? '' 
            : await DepositManager_CONTRACT.processRequests( 
              selectedModalData.layer2,
              selectedModalData.withdrawableLength,
              option === 'TON' ? true : false,
            );
        setTx(tx);
        setTxPending(true);

        return closeThisModal();
      }
    } catch (e) {
      console.log(e);
    }
  }, [DepositManager_CONTRACT, closeThisModal, selectedModalData, setTxPending]);

  console.log(value)

  return (
    <Flex flexDir={'column'} w={'350px'} alignItems={'center'}>
      <Flex
       flexDir={'row'} 
       justifyContent={'space-between'}
       alignItems={'center'}
       w={'320px'}
       mb={'12px'}
      >
        <Flex
          fontSize={'14px'}
          fontWeight={500}
          color={'#3e495c'}
          // w={'110px'}
        >
          Withdraw history
        </Flex>
        <FormControl
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          w={'100px'}
        >
          <FormLabel
            fontSize={'11px'}
            fontWeight={'normal'}
            color={'#828d99'}
            mt={'5px'}
          >
            Restake
          </FormLabel>
          <Switch 
            bgColor={'#e7ebf2'}
            borderRadius={'100px'}
            p={'1px'}
            colorScheme='green' 
            onChange={() =>
              toggle === 'Withdraw'
                ? handleToggle()
                : setToggle('Withdraw')
            }
          />
        </FormControl>
      </Flex>
      <Flex>
        {
          requests ?
          <WithdrawTable 
            columns={columns}
            data={requests}
            getCheckboxProps={getCheckboxProps}
            setValue={setValue}
            toggle={toggle}
            value={value}
          /> : ''
        }
      </Flex>
      <Flex my={'21px'} h={'75px'} flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
        <Flex
          fontSize={'12px'}
          fontWeight={500}
          color={'#808992'}
          mb={'5px'}
        >
          Total amount of {
            toggle === 'Withdraw' ?
            <Flex color={'#2a72e5'} mx={'3px'}>
              Withdraw
            </Flex> :
            <Flex color={'#36af47'} mx={'3px'}>
              Restake
            </Flex>
          } available
        </Flex>
        <Flex 
          fontSize={'18px'}
          fontWeight={500}
          color={'#3d495d'}
        >
          <Flex mr={'9px'}>
            {
              toggle === 'Withdraw'
                ? selectedModalData.withdrawable
                : selectedModalData.pendingUnstaked
            }
          </Flex>
          {
            toggle === 'Restake' ?
            <Flex>
              TON
            </Flex> :
            <TokenSelector 
              option={option}
              setOption={handleSetOption}
              menuState={menuState}
              setMenuState={setMenuState}
              options={options}
            />
          }
        </Flex>
      </Flex>
      <Flex w={'100%'} h={'1px'}  bgColor={'#f4f6f8'} mb={'15px'} />
      <Flex flexDir={'column'} alignItems={'center'} >
        {
          toggle === 'Restake' ?
          <StakingCheckbox 
            content={'Restaking unstaked TON earns you TON from staking. However, to withdraw, they need to be unstaked and wait for 93,046 blocks (~14 days).'}
            handleCheckboxChange={handleCheckboxChange}
          />
           : ''
        }
        <Button
          {...btnStyle.btnAble()}
          w={'130px'}
          h={'38px'}
          mt={'25px'}
          fontSize={'14px'}
          fontWeight={500}
          isDisabled={!(isChecked && arrLength > 0)}
          bgColor={toggle === 'Restake' ? '#36af47' : ''}
          _hover={
            toggle === 'Restake' ?
            { bgColor: '#36af47' } : 
            ''
          }
          onClick={() => toggle === 'Restake' ? reStaking() : withdraw()}
        >
          {toggle}
        </Button>
      </Flex>
    </Flex>
  )
}