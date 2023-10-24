import { Flex, Modal, ModalBody, ModalContent, ModalOverlay, useTheme, Text, Button } from '@chakra-ui/react';
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
import Coinage from "services/abi/AutoRefactorCoinage.json"

function StakeModal() {
  const theme = useTheme();
  const { btnStyle } = theme;

  const { selectedModalData, selectedModal, closeModal, isModalLoading } = useModal();
  const { account, library } = useWeb3React();

  const { TON_ADDRESS, WTON_ADDRESS, DepositManager_ADDRESS } = CONTRACT_ADDRESS;

  const { TON_CONTRACT, WTON_CONTRACT, DepositManager_CONTRACT, SeigManager_CONTRACT } = useCallContract();

  const [input, setInput] = useRecoilState(inputState);
  const [txPending, setTxPending] = useRecoilState(txState);
  const [tx, setTx] = useState();

  let modalComponent = undefined;
  if (selectedModal && selectedModalData) {
    modalComponent = getStakeModalComponent(selectedModal, selectedModalData);
  }
  // console.log(selectedModalData)
  // console.log(modalComponent?.balance)

  const closeThisModal = useCallback(() => {
    // setResetValue();
    setInput('0');
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

  const unStaking = useCallback(async () => {
    try {
      const amount = floatParser(input);
      if (DepositManager_CONTRACT && SeigManager_CONTRACT && amount && account && selectedModalData) {
        //@ts-ignore 
        // const coinage = getContract(await SeigManager_CONTRACT.coinages(selectedModalData.layer2), Coinage, library, account)
        // const bal = await coinage.balanceOf(account)
        // console.log(bal.toString(), convertToRay(amount.toString()))
        // operator 일 경우 minimum amount 남겨둬야함
        
        const tx = await DepositManager_CONTRACT.requestWithdrawal(
          //@ts-ignore
          selectedModalData.layer2,
          convertToRay(amount.toString()),
        );
        setTx(tx);
        setTxPending(true);
        return closeThisModal();
      }

    } catch (e) {
      console.log(e)
    }
  }, [DepositManager_CONTRACT, closeThisModal, input, selectedModalData, setTx, setTxPending]);

  const reStaking = useCallback(async () => {
    // if (
    //   confirm(
    //     'Stake, Unstake, and Restake functionalities are temporarily disabled. Please refer to the posting for more details and check our official Twitter page for updates',
    //   )
    // ) {
  
    // }
    const amount = floatParser(input);
    if (DepositManager_CONTRACT && account) {
      //@ts-ignore
      const numPendRequest = await DepositManager_CONTRACT.numRequests(selectedModalData.layer2, account);
      //@ts-ignore
      const tx = await DepositManager_CONTRACT.redepositMulti(selectedModalData.layer2, numPendRequest);
      setTx(tx);
      setTxPending(true);
      return closeThisModal();
    }
  }, [input, DepositManager_CONTRACT, account, selectedModalData, setTxPending, closeThisModal]);

  const withdraw = useCallback(async () => {
    if (selectedModalData && DepositManager_CONTRACT) {
     //@ts-ignore
      const tx = await DepositManager_CONTRACT.processRequests(
          //@ts-ignore
        selectedModalData.layer2,
          //@ts-ignore
        selectedModalData.withdrawableLength,
        true,
      );
      setTx(tx);
      setTxPending(true);
      return closeThisModal();
    }
  }, [DepositManager_CONTRACT, closeThisModal, selectedModalData, setTxPending]);

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
                <Flex
                  w={'350px'}
                  borderY={'1px'}
                  py={'14px'}
                  borderColor={'#f4f6f8'}
                  flexDir={'column'}
                  alignItems={'center'}
                >
                  <Flex h={'84px'} alignItems={'center'} flexDir={'row'} justifyContent={'center'} w={'100%'}>
                    {selectedModal === 'restaking' || selectedModal === 'withdraw' ? (
                      <Text fontSize={'38px'} fontWeight={500}>
                        {modalComponent.balance}
                      </Text>
                    ) : (
                      <BalanceInput w={'220px'} placeHolder={'0'} type={'staking'} maxValue={modalComponent.balance} />
                    )}
                  </Flex>
                  {selectedModal === 'withdraw' ? (
                    <Flex w={'100%'} flexDir={'column'} alignItems={'center'}>
                      <WithdrawModalBody title={modalComponent.balanceInfo1} value={modalComponent.balance1} />
                      <WithdrawModalBody title={modalComponent.balanceInfo2} value={modalComponent.balance} />
                    </Flex>
                  ) : (
                    <Flex w={'100%'} flexDir={'column'} alignItems={'center'}>
                      <Text fontSize={'12px'} fontWeight={500} color={'#808992'}>
                        {modalComponent.balanceInfo}
                      </Text>
                      {/* @ts-ignore */}
                      <Text mt={'5px'}>{modalComponent.balance} TON</Text>
                    </Flex>
                  )}
                </Flex>
                {/* modal footer */}
                <Flex flexDir={'column'} alignItems={'center'}>
                  <Text my={'25px'} color={'#2a72e5'} fontSize={'12px'} fontWeight={500}>
                    {modalComponent.bottomComment}
                  </Text>
                  <Button
                    w={'150px'}
                    {...(input && input !== '0'
                      ? { ...btnStyle.btnAble() }
                      : selectedModal === 'restaking' || selectedModal === 'withdraw'
                      ? { ...btnStyle.btnAble() }
                      : { ...btnStyle.btnDisable() })}
                    onClick={
                      selectedModal === 'staking'
                        ? staking
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
