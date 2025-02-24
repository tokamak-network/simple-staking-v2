import { 
  Text,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  Switch,
  useTheme,
  MenuList,
  useCheckboxGroup, 
  MenuItem
} from "@chakra-ui/react"
import {useCallback, useEffect, useMemo, useState} from 'react';
// import { StakeModalDataType } from '../../../../../types/index';
// import WithdrawTable from "./WithdrawTable";
import { TokenSelector } from "@/common/menulist/TokenSelector";
import { StakingCheckbox } from "@/common/checkbox/StakingCheckbox";
import WithdrawTable from "../../../../common/modal/withdraw/WithdrawTable";
import { convertNumber } from "@/components/number";
import useCallContract from "@/hooks/useCallContract";
import { useRecoilState } from "recoil";
import { useWeb3React } from "@web3-react/core";
import { arraysEqual, findMax, range } from "@/components/array";
import { inputState } from "@/atom/global/input";
import { txState } from "@/atom/global/transaction";
import { useWithdrawable } from '@/hooks/staking/useWithdrawable';

type MobileWithdrawToEthereumProps ={
  selectedOp: any 
  requests: any
  onClose: any
  toggle: string
}

export function MobileWithdrawToEthereum (args: MobileWithdrawToEthereumProps) {
  const {selectedOp, requests, onClose, toggle} = args
  const theme = useTheme();
  const { btnStyle } = theme;
  const [option, setOption] = useState('WTON')
  const [menuState, setMenuState] = useState(false);

  
  const [withRequests, setWithRequests] = useState()

  useEffect(() => {
    setMenuState(false);
  }, [])

  const { 
    DepositManager_CONTRACT, 
  } = useCallContract();

  const [input,] = useRecoilState(inputState);
  const { account } = useWeb3React();
  const [, setTxPending] = useRecoilState(txState);
  const [tx, setTx] = useState();
  const [arrLength, setArrLength] = useState(0);

  const { value, setValue, getCheckboxProps, isDisabled } = useCheckboxGroup()
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(e.target.checked);

  const { withdrawable, withdrawableLength } = useWithdrawable(
    selectedOp?.candidateContract,
  );

  // useEffect(() => {
  //   const fetch = async () => {
  //     if (selectedOp) {
  //       const withdrawRequest = await useWithdrawable(selectedOp.candidateContract)
  //       setWithRequests(withdrawRequest)
  //     }
  //   }
  //   fetch()
  // }, [selectedOp])

  const pendingUnstaked = selectedOp ?
    convertNumber({
      amount: selectedOp.pending,
      type: 'ray',
      localeString: true
    }) : '0.00'

    // const withdrawble = requests.filter((request: any) => {
    //   return request.time === 'Withdrawable'
    // })

  const staked = selectedOp ?
    convertNumber({
      amount: selectedOp.stakeOf,
      type: 'ray',
      localeString: true
    }) : '0.00'

  const options = ['WTON', 'TON']
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

  // useEffect(() => {
  //   let isMounted = true;
  //   let maxIndex = 0
  //   async function fetch() {
  //     if (DepositManager_CONTRACT) {
  //       let requestIndex = await DepositManager_CONTRACT.withdrawalRequestIndex(selectedOp.candidateContract, account)
  //       // console.log('a', requestIndex.toString())
  //       if (isMounted) {
  //         if (value.includes('a')) return;
  //         maxIndex = findMax(value);
  //         const fillRange = range(+requestIndex.toString(), maxIndex);
  //         if (!arraysEqual(fillRange, value)) {
  //           setValue(fillRange);
  //         }
  //       }
  //     }
  //   }
  //   fetch()
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [value])

  const reStaking = useCallback(async () => {
    try {
      if (DepositManager_CONTRACT && account && selectedOp && arrLength !== 0) {
        const tx = await DepositManager_CONTRACT.redepositMulti(selectedOp.candidateContract, arrLength);
        setTx(tx);
        setTxPending(true);

        return onClose();
      }
    } catch (e) {
      console.log(e);
    }
  }, [arrLength, DepositManager_CONTRACT, account, selectedOp, setTxPending, onClose]);

  const withdraw = useCallback(async () => {
    try {
      if (selectedOp && DepositManager_CONTRACT && selectedOp) {
        const tx =
            selectedOp.withdrawableLength === '0' 
            ? '' 
            : await DepositManager_CONTRACT.processRequests( 
              selectedOp.candidateContract,
              arrLength,
              option === 'TON' ? true : false,
            );
        setTx(tx);
        setTxPending(true);

        return onClose();
      }
    } catch (e) {
      console.log(e);
    }
  }, [DepositManager_CONTRACT, onClose, selectedOp, setTxPending]);

  return (
    <Flex flexDir={'column'} w={'100%'} alignItems={'center'} h={'100%'}>
      <Flex flexDir={'column'} justifyContent={'space-between'} h={'100%'} w={'100%'}>
        <Flex
          flexDir={'row'} 
          justifyContent={'center'}
          alignItems={'center'}
          w={'100%'}
          mb={'12px'}
        >
          <Flex
            fontSize={'14px'}
            fontWeight={500}
            color={'#3e495c'}
            // w={'110px'}
          >
            Pending Withdrawal
          </Flex>
          {/* <FormControl
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
                  ? setToggle('Restake')
                  : setToggle('Withdraw')
              }
            />
          </FormControl> */}
        </Flex>
        {
          requests ?
          <Flex>
            <WithdrawTable 
              columns={columns}
              data={requests}
              toggle={toggle}
            />
          </Flex> : ''
        }
        <Flex my={'21px'} h={'75px'} flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
          <Flex
            fontSize={'12px'}
            fontWeight={500}
            color={'#808992'}
            mb={'5px'}
          >
            Total amount to {
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
                ? withdrawable
                : pendingUnstaked
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
      </Flex>
      <Flex w={'100%'} flexDir={'column'} alignItems={'center'}>
        {
          toggle === 'Restake' ?
          <StakingCheckbox 
            content={'Restaking unstaked TON earns you TON from staking. However, to withdraw, they need to be unstaked and wait for 93,046 blocks (~14 days).'}
            handleCheckboxChange={handleCheckboxChange}
            isChecked={isChecked}
          />
           : ''
        }
        <Button
          {...btnStyle.btnAble()}
          w={'100%'}
          h={'40px'}
          mt={'25px'}
          mb={'15px'}
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

export default MobileWithdrawToEthereum