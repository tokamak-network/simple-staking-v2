
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Text,
  Box,
  Link,
  Spinner,
} from "@chakra-ui/react";
import Image from "next/image";
import useModal from '@/hooks/useModal';
import { useCallback, useEffect, useState } from 'react';
// import "@/css/spinner.css";
import ConfirmedImage from "assets/images/modal/confirmed.svg";
import ErrorImage from "assets/images/modal/error.svg";
import CloseIcon from "assets/images/modal/close.svg";
import Check from "assets/images/modal/check.svg";
import useTxConfirmModal from '@/hooks/useTxConfirmModal';
import { useRecoilState, useRecoilValue } from 'recoil';
import { txHashStatus } from '@/atom/global/transaction';
import { ETHERSCAN_LINK } from "@/constants";
import { getModeData } from "@/atom/global/modal";

export default function ConfirmationTX() {
  // const { blockExplorer, connectedChainId } = useConnectedNetwork();
  const txHash = useRecoilValue(txHashStatus);

  const {
    isConfirmed,
    isConfirming,
    isError,
    isOpen,
    isWaiting,
    closeModal,
  } = useTxConfirmModal();
  // const { mode, subMode } = useGetMode();

  const [selectedMode, setSelectedMode] = useRecoilState(getModeData);
  
  const closeThisModal = useCallback(() => {
    
    closeModal();
  }, [
    // subMode,
    isConfirmed,
    isConfirming,
    isError,
    closeModal,
  ]);

  return (
    <Modal isOpen={isOpen} onClose={closeThisModal} closeOnOverlayClick={false} isCentered>
      <ModalOverlay />
      <ModalContent
        // h={"100%"}
        bg={"transparent"}
        justifyContent={"center"}
        alignItems={"center"}
        w={"254px"}
        bgColor={"#fff"}
        borderRadius={"16px"}
        containerProps={{
          zIndex: '2000',
        }}
      >
        <Flex
          // w={"254px"}
          // h={"350px"}
          
          
          flexDir={"column"}
          alignItems={"center"}
        >
          <Flex w={"100%"} justifyContent={"flex-end"} pt={"14px"} pr={"14px"}>
            {
              !isWaiting ?
              <Image
                src={CloseIcon}
                alt={"CloseIcon"}
                style={{ cursor: "pointer" }}
                onClick={closeThisModal}
              /> : ''
            }
          </Flex>
          <Text mt={"26px"} fontSize={18} mb={"41px"} fontWeight={700} textAlign={'center'}>
            {
              isWaiting
                ? `Confirming ${selectedMode}`
                : isConfirming
                ? 'Transaction submitted'
                : isConfirmed
                ? "Transaction Confirmed"
                : isError
                ? "Transaction Failed"
                : null
            }
          </Text>
          <Flex pos={"relative"} w={"100%"} justifyContent={"center"}>
            {isWaiting || isConfirming ? (
              // <Box w={"96px"} h={"96px"} className="loading2 spinner2" />
              <Spinner 
                w={'96px'} 
                h={'96px'} 
                emptyColor="#f7f8fb" 
                color={'#257eee'} 
                thickness={'7px'} 
                speed='0.8s'
                
              />
            ) : isConfirmed ? (
              <Flex>
                <Image src={ConfirmedImage} alt={"ConfirmedImage"} />
                <Image
                  src={Check}
                  alt={"Check"}
                  style={{
                    position: "absolute",
                    top: "35%",
                    left: "40%",
                  }}
                />
              </Flex>
            ) : isError ? (
              <Image src={ErrorImage} alt={"ErrorImage"} />
            ) : null}
          </Flex>
          <Text
            w={"254px"}
            mt={"42px"}
            mb={'30px'}
            px={isConfirming ? "29px" : ""}
            textAlign={"center"}
            fontSize={14}
            lineHeight={"26px"}
            // fontWeight={500}
          >
            {isWaiting ? (
              "Please wait a few seconds for MetaMask popup to appear."
            ) : isConfirming ? (
              "Waiting for transaction to be confirmed."
            ) : isConfirmed ? (
              <Link
                href={`${ETHERSCAN_LINK}/tx/${txHash}`}
                isExternal={true}
                textDecoration={"underline"}
                w={"100%"}
              >
                See your transaction history
              </Link>
            ) : isError ? (
              "Error occurred, please try again."
            ) : null}
          </Text>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
