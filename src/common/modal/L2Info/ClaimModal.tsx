import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useTheme,
} from '@chakra-ui/react';
import useClaimModal from '@/hooks/useClaimModal';
import { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ModalHeader } from '../../../pages/components/staking/modal/ModalHeader';
import { inputState } from '@/atom/global/input';
import { useRecoilState } from 'recoil';
import trimAddress from '@/components/trimAddress';
import { txHashStatus, txState } from '@/atom/global/transaction';
import { getContract } from '@/components/getContract';
import CandidateAddOn from 'services/abi/CandidateAddOn.json'
import { getModeData, transactionModalOpenStatus, transactionModalStatus } from '@/atom/global/modal';

function ClaimModal () {
  const theme = useTheme();
  const { btnStyle } = theme;

  const { selectedModalData, selectedModal, closeModal, isModalLoading } = useClaimModal();
  const { account, library } = useWeb3React();

  const [modalName, setModalName] = useState('')
  const [type, setType] = useState('main')
  const [tx, setTx] = useState();
  const [, setTxPending] = useRecoilState(txState);
  const [, setModalOpen] = useRecoilState(transactionModalStatus);
  const [, setIsOpen] = useRecoilState(transactionModalOpenStatus);
  const [, setSelectedMode] = useRecoilState(getModeData);
  const [, setTxHash] = useRecoilState(txHashStatus)

  const [input, setInput] = useRecoilState(inputState);

  const closeThisModal = useCallback(() => {
    setInput('');
    setType('main')
    closeModal();
  }, [closeModal]);

  useEffect(() => {
    if (selectedModalData) {
      setModalName(selectedModalData.name)
    }
  }, [selectedModalData])

  const updateSeig = useCallback(async (type: number) => {
    if (account && library && selectedModalData) {
      try {
        setSelectedMode(selectedModalData.name);
        setIsOpen(true)
        setModalOpen("waiting")

        const CandidateAddOn_CONTRACT = getContract(selectedModalData.contractAddress, CandidateAddOn, library, account)
        const tx = await CandidateAddOn_CONTRACT.updateSeigniorage(type)

        setTx(tx);
        setTxPending(true);
        setTxHash(tx.hash)
        
        setModalOpen("confirming")

        if (tx) {
          await tx.wait().then((receipt: any) => {
            if (receipt.status) {
              setModalOpen("confirmed")
              setTxPending(false);
              setTx(undefined);
            }
          });
        }
      } catch (e) {
        console.log(e)
        setModalOpen("error")
        setTxPending(false);
        setTx(undefined);
      }
    }
  }, [account, library, selectedModalData])
  
  return (
    <Modal
      isOpen={
        selectedModal === 'claim'
      }
      isCentered
      onClose={closeThisModal}
    >
      <ModalOverlay>
        <ModalContent 
          maxW={'350px'} 
          bg={'#fff'} 
          borderRadius={'15px'} 
          boxShadow={'0 2px 6px 0 rgba(61, 73, 93, 0.1)'}
        >
          {selectedModalData ? (
            <ModalBody>
              <Flex w="100%" flexDir={'column'} alignItems={'center'} py={'20px'}>
                <Flex flexDir={'row'}  justifyContent={type !== 'main' ? 'start' : 'center'} w={'100%'}>
                  <ModalHeader
                    main={modalName}
                    sub={''}
                    closeThisModal={closeThisModal}
                    type={4}
                  />
                </Flex>
                <Flex bgColor={'#f4f6f8'} h={'1px'}  w={'100%'} />
                <Flex 
                  my={'45px'} 
                  flexDir={'column'} 
                  justifyContent={'center'} 
                  alignItems={'center'}
                  fontSize={'13px'}
                >
                  <Flex
                    fontWeight={500}
                    color={'#808992'}
                    fontSize={'12px'}
                  >
                    Sequencer seigniorage 
                    {
                      selectedModalData.name === 'Claim' ?
                      ''
                      : ' + Unclaimed Staking Reward'
                    }
                  </Flex>
                  {/* <Flex
                    color={'#2a72e5'}
                    fontWeight={500}
                    mb={'9px'}
                  >
                    
                    {selectedModalData.target ? 
                      trimAddress({
                        address: selectedModalData.target,
                        firstChar: 4,
                        lastChar: 4,
                        dots:' ...'
                      }) : ''
                    }
                  </Flex> */}
                  <Flex
                    fontWeight={500}
                    color={'#3e495c'}
                    fontSize={'13px'}
                  >
                    {selectedModalData.claimable} WTON 
                    {
                      selectedModalData.name === 'Claim' 
                      ? '' 
                      : ` + ${selectedModalData.expectedSeigs} WTON`
                    } 
                  </Flex>
                  <Flex 
                    mt={'39px'}
                    fontSize={'13px'}
                    color={'#808992'}
                    fontWeight={500}
                  >
                    {
                      selectedModalData.name === 'Claim'
                      ? <Flex>
                        Claim
                        <span 
                          style={{
                            marginLeft:'3px',
                            color: '#3E495C',
                            fontWeight: 600
                          }}
                        >
                          {selectedModalData.claimable} WTON
                        </span>
                      </Flex>
                      : 
                      <Flex>
                        Stake 
                        <span 
                          style={{
                            marginLeft:'3px',
                            marginRight:'3px',
                            color: '#3E495C',
                            fontWeight: 600
                          }}
                        >
                          {selectedModalData.expectedSeig} TON 
                        </span>
                        to {selectedModalData.layerName}
                      </Flex>
                    }
                  </Flex>
                  <Flex 
                    fontSize={'13px'}
                    color={'#808992'}
                    fontWeight={500}
                  >
                    {selectedModalData.name === 'Claim'
                      ? 'to' : 'using the'} 
                    <span 
                      style={{
                        marginLeft:'3px',
                        marginRight:'3px',
                        color: '#3E495C',
                        fontWeight: 600
                      }}
                    >
                      {
                        selectedModalData.address ? 
                          trimAddress({
                            address: selectedModalData.address,
                            firstChar: 4,
                            lastChar: 4,
                            dots:' ...'
                          }) : ''
                      }
                    </span>
                    account
                  </Flex>
                </Flex>
                <Flex bgColor={'#f4f6f8'} h={'1px'}  w={'100%'} />
                <Flex>
                <Button
                  {...btnStyle.btnAble()}
                  w={'130px'}
                  h={'38px'}
                  mt={'25px'}
                  fontSize={'14px'}
                  fontWeight={500}
                  border={'none'}
                  // isDisabled={!isChecked}
                  onClick={() => updateSeig(selectedModalData.name === 'Claim' ? 1 : 2)}
                >
                  {selectedModalData.name}
                </Button>
                </Flex>
              </Flex>
            </ModalBody>
          ): ''} 
        </ModalContent>
      </ModalOverlay>
      
    </Modal>
  )

}

export default ClaimModal