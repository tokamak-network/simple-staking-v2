import { getDate } from '@/components/getDate';
import { Box, Button, Flex } from '@chakra-ui/react';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import L2Content from './L2Content';
import { convertLargeNumber, convertNumber } from '@/components/number';
import { useIsOperator } from '@/hooks/staking/useIsOperator';
import L2InfoContent from './L2InfoContent';
import ClaimModal from '@/common/modal/L2Info/ClaimModal';
import { ClaimModalDataType } from '@/types';
import { ModalType } from '@/types/modal';
import { modalData, modalState } from '@/atom/global/modal';
import { useRecoilState, useRecoilValue } from 'recoil';
import { editL2Info_bridge_input, editL2Info_bridge_state, editL2Info_explorer_input, editL2Info_explorer_state, editL2Info_logo_input, editL2Info_logo_state } from '@/atom/staking/editL2Info';
import useContract from '@/hooks/useContract';
import CandidateAddOn from "services/abi/CandidateAddOn.json"
import OperatorManager from "services/abi/OperatorManager.json"
import { useWeb3React } from '@web3-react/core';
import { getContract } from '@/components/getContract';
import { txState } from '@/atom/global/transaction';
import { useExpectedSeig } from '@/hooks/staking/useCalculateExpectedSeig';
import { floatParser } from '../../../utils/number';

type L2InformationProps = {
  data: any;
};

function L2Information({ data }: L2InformationProps) {
  const { account, library } = useWeb3React()
  // const {

  // } = data?.candidateAddOn
  const [editStat, setEditStat] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [target, setTarget] = useState('');
  const [address, setAddress] = useState('');
  const [layerName, setLayerName] = useState('');

  const [selectedModal, setSelectedModal] = useRecoilState(modalState);
  const [, setSelectedModalData] = useRecoilState(modalData);
  const [, setTxPending] = useRecoilState(txState);
  const [tx, setTx] = useState();

  console.log(data);

  const [bridgeValue, setBridgeValue] = useRecoilState(editL2Info_bridge_input);
  const [explorerValue, setExplorerValue] = useRecoilState(editL2Info_explorer_input);
  const [logoValue, setLogoValue] = useRecoilState(editL2Info_logo_input);

  const CandidateAddOn_CONTRACT = useContract(data?.candidateContract, CandidateAddOn);
  
  const { 
    isOperator, 
    l2Infos, 
    bridgeTypes, 
    operatorManager,
    managers,
    claimable
  } = useIsOperator(data?.candidateContract)
  
  useEffect(() => {
    if (l2Infos) {
      setBridgeValue(l2Infos.bridge)
      setExplorerValue(l2Infos.explorer)
      setLogoValue(l2Infos.logo)
    }
  }, [l2Infos])

  useEffect(() => {
    if (data) {
      setContractAddress(data.candidateContract)
      setAmount('')
      setAddress(managers)
      setTarget(operatorManager)
      setLayerName(data.name)
    }
  },[data, managers, operatorManager]);
  
  const claimableAmount = claimable
    ? convertNumber({
        amount: claimable,
        type: 'ray',
        localeString: true,
      })
    : '0.00';
  
    const expectedSeig = data?.expectedSeig
    ? convertNumber({
        amount: data?.expectedSeig,
        type: 'ray',
        localeString: true,
      })
    : '0.00';

  const converted = data?.lockedInBridge
    ? convertNumber({
        amount: data?.lockedInBridge,
        type: 'wei',
        localeString: true,
      })
    : '0.00';

    
    //@ts-ignore
    const stakableAmount = floatParser(claimableAmount) + floatParser(expectedSeig) 
    const stakable = stakableAmount.toLocaleString(undefined,{maximumFractionDigits: 2})
    

    const dataModal: ClaimModalDataType = {
      amount: amount,
      target: target,
      address: address,
      name: '',
      contractAddress: contractAddress,
      claimable: claimableAmount ? claimableAmount : '0.00',
      expectedSeig: stakable,
      layerName: layerName
    }
  
    const modalButton = useCallback(async (modalType: ModalType, name: string, data: any) => {
      // setName(name)
      setSelectedModal(modalType);
      setSelectedModalData({
        ...data,
        name: name,
      });
    }, [dataModal]);
  
  const setL2Info = useCallback(async () => {
    if (data) {
      try{
        if (CandidateAddOn_CONTRACT && account) {
          const operatorAddress = await CandidateAddOn_CONTRACT.operator()
          const OperatorManager_CONTRACT = await getContract(operatorAddress, OperatorManager, library, account)
          const data = {
            bridge: bridgeValue,
            explorer: explorerValue,
            logo: logoValue
          }
          const stringifyData = JSON.stringify(data)
          const tx = await OperatorManager_CONTRACT.setL2Info(stringifyData)
  
          setTx(tx);
          setTxPending(true);
          setEditStat(false)
          setBridgeValue('')
          setExplorerValue('')
          setLogoValue('')

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
    }
  }, [bridgeValue, explorerValue, logoValue])

  return (
    <Flex
      w="100%"
      m={0}
      justifyContent={'space-between'}
      alignItems="start"
      // pt="70px"
      border={'none'}
      flexDir={'column'}
      ml={'70px'}
    >
      <Flex flexDir={'column'} mt={'36px'}>
        <Flex fontSize={'18px'} fontWeight={500} color={'#2a72e5'} flexDir={'row'} mb={'18px'}>
          <Flex>
            L2 Info
          </Flex>
          <Flex
            ml={'12px'}
            mt={'2px'}
          >
            {
              isOperator && !editStat ?
              <Button 
                w={'59px'}
                h={'21px'}
                borderRadius={'4px'}
                border={'1px solid #dfe4ee'}
                bgColor={'#fff'}
                color={'#86929d'}
                fontSize={'12px'}
                fontWeight={400}
                onClick={() => setEditStat(true)}
              >
                Edit
              </Button> :
              isOperator && editStat ?
              <Flex>
                <Button 
                  w={'59px'}
                  h={'21px'}
                  borderRadius={'4px'}
                  border={'1px solid #2a72e5'}
                  bgColor={'#fff'}
                  color={'#2a72e5'}
                  fontSize={'12px'}
                  fontWeight={400}
                  onClick={() => setL2Info()}
                >
                  Confirm
                </Button>
                <Button 
                  w={'59px'}
                  h={'21px'}
                  ml={'6px'}
                  borderRadius={'4px'}
                  border={'1px solid #dfe4ee'}
                  bgColor={'#fff'}
                  color={'#86929d'}
                  fontSize={'12px'}
                  fontWeight={400}
                  onClick={() => setEditStat(false)}
                >
                  Cancel
                </Button>
              </Flex> : ''
            }
          </Flex>
        </Flex>
        <Flex flexDir={'row'}>
          {
            editStat ? '' :
            <L2InfoContent 
              title={'L2 Rollup Type'} 
              content={
                bridgeTypes === 1 
                ? 'Titan Tokamak'
                : bridgeTypes === 2
                ? 'Thanos Tokamak'
                : 'Unknown'
              } 
              type={'string'} 
            />
          }
          <L2InfoContent title={'Bridge'} content={l2Infos?.bridge} type={'bridge'} editStat={editStat} />
          <L2InfoContent title={'Block explorer'} content={l2Infos?.explorer} type={'explorer'} editStat={editStat} />
          {
            isOperator ?
            <L2InfoContent title={'L2 Logo'} content={data?.name} type={'logo'} editStat={editStat} /> : ''
          }
        </Flex>
      </Flex>
      <Flex flexDir={'column'} my={'54px'}>
        <Flex fontSize={'18px'} fontWeight={500} color={'#2a72e5'} mb={'18px'}>
          Sequencer seigniorage
        </Flex>
        <Flex flexDir={'row'}>
          <L2Content title={'TON locked in Bridge'} content={convertLargeNumber(converted)} content2={data?.candidateAddOn.bridge} type={'ton'} />
          <L2Content
            title={'Earned seigniorage'}
            content={claimableAmount}
            content2={stakable}
            type={'seig'}
            contractAddress={data?.candidateContract}
            isOperator={isOperator}
          />
          {
            isOperator ?
            <Flex 
              ml={'6px'} 
              alignItems={'end'}
              justifyContent={'center'} 
              w={'180px'}
            >
              <Button
                w={'80px'}
                h={'25px'}
                borderRadius={'4px'}
                border={'solid 1px #dfe4ee'}
                bgColor={'#fff'}
                color={'#86929d'}
                fontSize={'12px'}
                fontWeight={'normal'}
                _hover={{
                  borderColor: '#2a72e5',
                  color: '#2a72e5'
                }}
                onClick={()=> { modalButton('claim', 'Claim',  dataModal)}}
              >
                Claim
              </Button>
              <Button
                w={'80px'}
                h={'25px'}
                ml={'6px'}
                borderRadius={'4px'}
                border={'solid 1px #dfe4ee'}
                bgColor={'#fff'}
                color={'#86929d'}
                fontSize={'12px'}
                fontWeight={'normal'}
                _hover={{
                  borderColor: '#2a72e5',
                  color: '#2a72e5'
                }}
                onClick={()=> { modalButton('claim', 'Stake',  dataModal)}}
              >
                Stake
              </Button>
            </Flex> : ''
          }
        </Flex>
      </Flex>
      <ClaimModal />
    </Flex>
  );
}

export default L2Information;
