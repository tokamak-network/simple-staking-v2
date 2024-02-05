import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useTheme,
  Text,
  Button,
  Checkbox,
  Radio,
  RadioGroup,
  Box,
} from '@chakra-ui/react';
import useModal from '@/hooks/useModal';

import { useCallback, useEffect, useState } from 'react';
import { BalanceInput } from '@/common/input/CustomInput';
import { getStakeModalComponent } from '@/utils/getStakeModalComponent';
import CONTRACT_ADDRESS from '@/services/addresses/contract';
import { marshalString, unmarshalString } from '@/utils/marshalString';
import { padLeft } from 'web3-utils';
import useCallContract from '@/hooks/useCallContract';
import { convertToRay, convertToWei, floatParser } from '@/utils/number';
import { useRecoilState, useRecoilValue } from 'recoil';
import { inputBalanceState, inputState } from '@/atom/global/input';
import { useWeb3React } from '@web3-react/core';
import { txState } from '@/atom/global/transaction';
import { ModalHeader } from './modal/ModalHeader';
import { WithdrawModalBody } from './modal/WithdrawModalBody';
import { getContract } from '@/components/getContract';
import Candidate from 'services/abi/Candidate.json';

function StakeModal() {
  const theme = useTheme();
  const { btnStyle } = theme;

  const { selectedModalData, selectedModal, closeModal, isModalLoading } = useModal();
  const { account, library } = useWeb3React();

  const { TON_ADDRESS, WTON_ADDRESS, DepositManager_ADDRESS } = CONTRACT_ADDRESS;

  const { TON_CONTRACT, WTON_CONTRACT, Old_DepositManager_CONTRACT, DepositManager_CONTRACT, SeigManager_CONTRACT } =
    useCallContract();

  const [input, setInput] = useRecoilState(inputState);
  const [, setTxPending] = useRecoilState(txState);
  const [tx, setTx] = useState();
  const [withdrawType, setWithdrawType] = useState('');
  const [tokenType, setTokenType] = useState('');

  //@ts-ignore
  let modalComponent = undefined;
  if (selectedModal && selectedModalData) {
    modalComponent = getStakeModalComponent(selectedModal, selectedModalData);
  }
  const withdrawSetting = useCallback(
    (value: string) => {
      setWithdrawType(value);
      
      let inputTemp = 
        withdrawType === 'new' ?
          //@ts-ignore 
          modalComponent.balance2 : 
          //@ts-ignore
          modalComponent.balance3;
      setInput(inputTemp);
    },
    [modalComponent, withdrawType],
  );

  const closeThisModal = useCallback(() => {
    // setResetValue();
    setInput('0');
    setTokenType('ton')
    closeModal();
  }, [setInput, closeModal]);

  const getData = useCallback(() => {
    if (selectedModalData)
      return marshalString(
        //@ts-ignore
        [DepositManager_ADDRESS, selectedModalData.layer2]
          .map(unmarshalString)
          .map((str) => padLeft(str, 64))
          .join(''),
      );
  }, [DepositManager_ADDRESS, selectedModalData]);

  const getDataForWton = useCallback(() => {
    if (selectedModalData) return marshalString(
      //@ts-ignore
      [selectedModalData.layer2]
        .map(unmarshalString)
        .map((str) => padLeft(str, 64))
        .join(''),
    )
  }, [selectedModalData])

  const staking = useCallback(async () => {
    const amount = floatParser(input);
    //@ts-ignore
    if (selectedModalData && Number(amount) > Number(floatParser(selectedModalData.tonBalance))) {
      return alert('Please check input amount.');
    }
    // if (
    //   confirm(
    //     'Stake, Unstake, and Restake functionalities are temporarily disabled. Please check our official Twitter page @tokamak_network for updates.',
    //   )
    // ) {
    const data = getData();
    if (TON_CONTRACT && amount) {
      const tx = await TON_CONTRACT.approveAndCall(WTON_ADDRESS, convertToWei(amount.toString()), data);
      setTx(tx);
      setTxPending(true);
      return closeThisModal();
    }
    // }
  }, [TON_CONTRACT, WTON_ADDRESS, closeThisModal, getData, input, selectedModalData, setTx, setTxPending]);

  const stakingWton = useCallback(async () => {
    const amount = floatParser(input);
    
    //@ts-ignore
    if (selectedModalData && Number(amount) > Number(floatParser(selectedModalData.wtonBalance))) {
      return alert('Please check input amount.');
    }
    
    const data = getDataForWton();
    if (WTON_CONTRACT && amount) {
      const tx = await WTON_CONTRACT.approveAndCall(
        DepositManager_ADDRESS, 
        convertToRay(amount.toString()), 
        data
      );
      setTx(tx);
      setTxPending(true);
      return closeThisModal();
    }
    
  }, [WTON_ADDRESS, closeThisModal, getData, input, selectedModalData, setTx, setTxPending]);

  const unStaking = useCallback(async () => {
    try {
      const amount = floatParser(input);
      if (DepositManager_CONTRACT && SeigManager_CONTRACT && amount && account && selectedModalData) {
        //@ts-ignore
        // const coinage = getContract(await SeigManager_CONTRACT.coinages(selectedModalData.layer2), Coinage, library, account)
        // const bal = await coinage.balanceOf(account)
        // console.log(bal.toString(), convertToRay(amount.toString()))
        // operator 일 경우 minimum amount 남겨둬야함
        if (
          confirm(
            `Warning:\nYou may lose unclaimed staking reward if you unstake before claiming them.\nCome back here after 2 weeks to withdraw your unstaked TON.`,
          )
        ) {
          const tx = await DepositManager_CONTRACT.requestWithdrawal(
            //@ts-ignore
            selectedModalData.layer2,
            convertToRay(amount.toString()),
          );
          setTx(tx);
          setTxPending(true);
        }
        return closeThisModal();
      }
    } catch (e) {
      console.log(e);
    }
  }, [DepositManager_CONTRACT, closeThisModal, input, selectedModalData, setTx, setTxPending]);

  const reStaking = useCallback(async () => {
    // if (
    //   confirm(
    //     'Stake, Unstake, and Restake functionalities are temporarily disabled. Please refer to the posting for more details and check our official Twitter page for updates',
    //   )
    // ) {

    // }
    if (DepositManager_CONTRACT && account) {
      //@ts-ignore
      const numPendRequest = await DepositManager_CONTRACT.numPendingRequests(selectedModalData.layer2, account);
      //@ts-ignore
      const tx = await DepositManager_CONTRACT.redepositMulti(selectedModalData.layer2, numPendRequest);
      setTx(tx);
      setTxPending(true);
      return closeThisModal();
    }
  }, [input, DepositManager_CONTRACT, account, selectedModalData, setTxPending, closeThisModal]);

  const withdraw = useCallback(async () => {
    if (selectedModalData && DepositManager_CONTRACT && Old_DepositManager_CONTRACT) {
      //@ts-ignore
      const tx =
        withdrawType === 'new'
          ? await DepositManager_CONTRACT.processRequests(
              //@ts-ignore
              selectedModalData.layer2,
              //@ts-ignore
              selectedModalData.withdrawableLength,
              tokenType === 'ton' ? true : false,
            )
          : await Old_DepositManager_CONTRACT.processRequests(
              //@ts-ignore
              selectedModalData.old_layer2,
              //@ts-ignore
              selectedModalData.old_withdrawableLength,
              tokenType === 'ton' ? true : false,
            );
      setTx(tx);
      setTxPending(true);

      return closeThisModal();
    }
  }, [DepositManager_CONTRACT, closeThisModal, selectedModalData, setTxPending]);

  const updateSeig = useCallback(async () => {
    if (account && library && selectedModalData) {
      //@ts-ignore
      const Candidate_CONTRACT = getContract(selectedModalData.layer2, Candidate.abi, library, account);
      const tx = await Candidate_CONTRACT.updateSeigniorage();
      setTx(tx);
      setTxPending(true);
    }
  }, []);

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

  const amountForCandidate = (value: string) => {
    let reducedValue;
    //@ts-ignore
    if (value) reducedValue = floatParser(value) - 1000;
    return reducedValue?.toLocaleString();
  };

  const seigChecker = (value: string) => {
    //@ts-ignore
    if (value) return floatParser(value) < 5;
  };

  useEffect(() => {
    if (
      selectedModal == 'withdraw' &&
      //@ts-ignore
      modalComponent.balance2 !== '0.00'
    ) {
      setWithdrawType('old');
      //@ts-ignore
      setInput(modalComponent.balance2);
    } else if (
      selectedModal == 'withdraw' &&
      //@ts-ignore
      modalComponent.balance2 === '0.00'
    ) {
      setWithdrawType('new')
      //@ts-ignore
      setInput(modalComponent.balance3)
    }
  }, [selectedModal]);

  return (
    <Modal
      isOpen={
        selectedModal === 'staking' ||
        selectedModal === 'unstaking' ||
        selectedModal === 'restaking' ||
        selectedModal === 'withdraw'
      }
      isCentered
      onClose={closeThisModal}
    >
      <ModalOverlay>
        <ModalContent bg={'#fff'} w={'350px'} borderRadius={'15px'} boxShadow={'0 2px 6px 0 rgba(61, 73, 93, 0.1)'}>
          {modalComponent ? (
            <ModalBody>
              <Flex w="100%" flexDir={'column'} alignItems={'center'} py={'20px'}>
                <ModalHeader
                  main={modalComponent.header}
                  sub={modalComponent.subHeader}
                  closeThisModal={closeThisModal}
                />
                {/* modal body */}
                {modalComponent && selectedModalData ? (
                  <Flex
                    w={'350px'}
                    borderY={'1px'}
                    py={'14px'}
                    borderColor={'#f4f6f8'}
                    flexDir={'column'}
                    alignItems={'center'}
                  >
                    {
                      selectedModal === 'staking' ?
                      <Flex
                        flexDir={'column'}
                      >
                        <Flex
                          fontSize={'12px'}
                          fontWeight={500}
                          color={'#808992'}
                        >
                          Select token to stake
                        </Flex>
                        <RadioGroup 
                          onChange={(value: 'ton' | 'wton') => setTokenType(value)} 
                          value={tokenType}
                        >
                          <Flex alignItems={'row'} my={'11px'} justifyContent={'center'}>
                            <Radio
                              value="ton"
                              h={'20px'}
                              mr={'6px'}
                              bgColor={'#fff'}
                              border={'solid 2px #c6cbd9'}
                              isChecked={true}
                            >
                              <Flex
                                fontSize={'16px'}
                                fontWeight={500}
                                color={'#3d495d'}
                                flexDir={'row'}
                                alignItems={'center'}
                              >
                                TON 
                              </Flex>
                            </Radio>
                            <Radio
                              value="wton"
                              h={'20px'}
                              mr={'6px'}
                              bgColor={'#fff'}
                              border={'solid 2px #c6cbd9'}
                              isChecked={false}
                            >
                              <Flex
                                fontSize={'16px'}
                                fontWeight={500}
                                color={'#3d495d'}
                                flexDir={'row'}
                                alignItems={'center'}
                              >
                                WTON 
                              </Flex>
                            </Radio>
                          </Flex>
                        </RadioGroup>
                      </Flex> :
                      ''
                    }
                    <Flex 
                      // h={'84px'} 
                      alignItems={'center'} 
                      flexDir={'row'} 
                      justifyContent={'center'} 
                      w={'100%'}
                    > 
                      {
                        selectedModal === 'restaking' ? (
                          <Text fontSize={'38px'} fontWeight={500}>
                            {modalComponent.balance}
                          </Text>
                        ) : selectedModal === 'withdraw' ? (
                          // <Text fontSize={'38px'} fontWeight={500}>
                          //   {withdrawType === 'old'
                          //     ? modalComponent.balance2
                          //     : withdrawType === 'new'
                          //     ? modalComponent.balance3
                          //     : '0.00'}
                          // </Text>
                          ''
                        ) : (
                          <BalanceInput
                            w={'220px'}
                            placeHolder={'0'}
                            type={'staking'}
                            maxValue={
                              selectedModal === 'unstaking' &&
                              //@ts-ignore
                              account.toLowerCase() === selectedModalData.candidate.toLowerCase()
                                ? amountForCandidate(modalComponent.balance)
                                : tokenType === 'wton'
                                ? modalComponent.balance2 
                                : modalComponent.balance
                            }
                          />
                      )}
                    </Flex>
                    {selectedModal === 'withdraw' ? (
                      <Flex w={'100%'} flexDir={'column'} alignItems={'center'} mb={'10px'} mt={'30px'}>
                        {/* <WithdrawModalBody 
                          title={modalComponent.balanceInfo1} 
                          value={modalComponent.balance1} 
                        /> */}
                        {/* <WithdrawModalBody title={modalComponent.balanceInfo2} value={modalComponent.balance2} /> */}
                        <Flex flexDir={'column'} alignItems={'center'}>
                          <Flex fontSize={'13px'} fontWeight={500} color={'#808992'}>
                            {modalComponent.balanceInfo2}
                          </Flex>
                          <RadioGroup 
                            onChange={(value: 'old' | 'new') => withdrawSetting(value)} 
                            value={withdrawType}
                          >
                            {
                              modalComponent.balance2 === '0.00' ? '' :
                              <Flex alignItems={'center'} mt={'11px'} justifyContent={'center'}>
                                <Radio
                                  value="old"
                                  h={'20px'}
                                  mr={'6px'}
                                  bgColor={'#fff'}
                                  border={'solid 2px #c6cbd9'}
                                  isChecked={true}
                                >
                                  <Flex
                                    fontSize={'16px'}
                                    fontWeight={500}
                                    color={'#3d495d'}
                                    flexDir={'row'}
                                    alignItems={'center'}
                                  >
                                    <Text mr={'3px'}>{`${modalComponent.balance2} ${tokenType === 'ton' ? `TON` : `WTON`}`}</Text>
                                    <Text fontSize={'12px'} color={'#2a72e5'}>
                                      (prior to patch)
                                    </Text>
                                  </Flex>
                                </Radio>
                              </Flex>
                            }
                            <Flex alignItems={'center'} justifyContent={'center'} mt={'11px'}>
                              <Radio value="new" h={'20px'} mr={'6px'} bgColor={'#fff'} border={'solid 2px #c6cbd9'}>
                                <Text fontSize={'16px'} fontWeight={500} color={'#3d495d'}>
                                  {`${modalComponent.balance3} ${tokenType === 'ton' ? `TON` : `WTON`}`}
                                </Text>
                              </Radio>
                            </Flex>
                          </RadioGroup>
                        </Flex>
                        <Flex
                          flexDir={'column'}
                          alignItems={'center'}
                          mt={'30px'}
                        >
                          <Flex
                            fontSize={'12px'}
                            fontWeight={500}
                            color={'#808992'}
                          >
                            Withdraw as
                          </Flex>
                          <RadioGroup 
                            onChange={(value: 'ton' | 'wton') => setTokenType(value)} 
                            value={tokenType}
                          >
                            <Flex alignItems={'row'} my={'11px'} justifyContent={'center'}>
                              <Radio
                                value="ton"
                                h={'20px'}
                                mr={'6px'}
                                bgColor={'#fff'}
                                border={'solid 2px #c6cbd9'}
                                isChecked={true}
                              >
                                <Flex
                                  fontSize={'16px'}
                                  fontWeight={500}
                                  color={'#3d495d'}
                                  flexDir={'row'}
                                  alignItems={'center'}
                                >
                                  TON 
                                </Flex>
                              </Radio>
                              <Radio
                                value="wton"
                                h={'20px'}
                                mr={'6px'}
                                bgColor={'#fff'}
                                border={'solid 2px #c6cbd9'}
                                isChecked={false}
                              >
                                <Flex
                                  fontSize={'16px'}
                                  fontWeight={500}
                                  color={'#3d495d'}
                                  flexDir={'row'}
                                  alignItems={'center'}
                                >
                                  WTON 
                                </Flex>
                              </Radio>
                            </Flex>
                          </RadioGroup>
                        </Flex>
                      </Flex>
                    ) : (
                      <Flex w={'100%'} flexDir={'column'} alignItems={'center'}>
                        <Text fontSize={'12px'} fontWeight={500} color={'#808992'}>
                          {
                            selectedModal === 'staking' && tokenType === 'wton' ? 
                              modalComponent.balanceInfo2 : 
                              modalComponent.balanceInfo
                          }
                        </Text>
                        {selectedModal === 'unstaking' &&
                        //@ts-ignore
                        account?.toLowerCase() === selectedModalData.candidate.toLowerCase() ? (
                          <Text fontSize={'11px'} fontWeight={'normal'} color={'#86929d'}>
                            (Operator's Minimum Staked Balance)
                          </Text>
                        ) : (
                          ''
                        )}
                        <Text mt={'5px'}>
                          {
                            selectedModal === 'staking' && tokenType === 'wton' ? 
                            `${modalComponent.balance2} WTON` :
                            `${modalComponent.balance} TON`
                          } 
                        </Text>
                        {
                          //@ts-ignore
                          selectedModal === 'unstaking' && account.toLowerCase() === selectedModalData.candidate ? (
                            <Text fontSize={'13px'} color={'#808992'} fontWeight={500}>
                              (1,000.1 TON)
                            </Text>
                          ) : (
                            ''
                          )
                        }
                      </Flex>
                    )}
                  </Flex>
                ) : (
                  ''
                )}
                {/* modal footer */}
                <Flex flexDir={'column'} alignItems={'center'} w={'100%'} justifyContent={'center'}>
                  {selectedModal === 'withdraw' ? (
                    ''
                  ) : (
                    <Flex mt={'25px'} color={'#2a72e5'} fontSize={'12px'} fontWeight={500} alignItems={'center'}>
                      {
                        //@ts-ignore
                        selectedModal === 'unstaking' && !seigChecker(selectedModalData.seig) ? (
                          <Flex color={'#2a72e5'} ml={'13px'}>
                            <Text
                              mr={'3px'}
                              cursor={'pointer'}
                              textDecoration={'underline'}
                              onClick={() => updateSeig()}
                            >
                              Claim
                            </Text>
                            <Text color={'#3e495c'}>{modalComponent.bottomComment}</Text>
                          </Flex>
                        ) : selectedModal === 'staking' &&
                          //@ts-ignore
                          !selectedModalData.minimumAmount ? (
                          <Box color={'#3e495c'} fontSize={'12px'} fontWeight={500} textAlign={'center'}>
                            <span style={{ color: '#ff2d78' }}>Warning</span>: operator have not met the minimum staked
                            balance requirement (at least 1,000.1 TON). As a result, there will be
                            <span style={{ color: '#2a72e5' }}> no staking reward</span>
                            <span> for staking on this layer2.</span>
                          </Box>
                        ) : (
                          ''
                        )
                      
                      }
                    </Flex>
                  )}
                  <Button
                    mt={'25px'}
                    w={'150px'}
                    //@ts-ignore
                    {...(input && floatParser(input) > 0
                      ? { ...btnStyle.btnAble() }
                      : selectedModal === 'restaking' || selectedModal === 'withdraw'
                      ? { ...btnStyle.btnAble() }
                      : { ...btnStyle.btnDisable() })}
                    //@ts-ignore
                    isDisabled={floatParser(input) === 0}
                    onClick={
                      selectedModal === 'staking' && tokenType === 'ton'
                        ? staking
                        : selectedModal === 'staking' && tokenType === 'wton'
                        ? stakingWton
                        : selectedModal === 'unstaking'
                        ? unStaking
                        : selectedModal === 'restaking'
                        ? reStaking
                        : withdraw
                    }
                  >
                    {modalComponent.buttonName}
                  </Button>
                </Flex>
              </Flex>
            </ModalBody>
          ) : (
            ''
          )}
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}

export default StakeModal;
