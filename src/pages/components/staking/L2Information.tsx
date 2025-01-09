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
import { useL2CandidateInfo } from '@/hooks/staking/useL2CandidateInfo';
import BasicTooltip from '@/common/tooltip';
import L2Info from '../../../../l2_info.json'

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

  // console.log(data);

  const [bridgeValue, setBridgeValue] = useRecoilState(editL2Info_bridge_input);
  const [explorerValue, setExplorerValue] = useRecoilState(editL2Info_explorer_input);
  const [logoValue, setLogoValue] = useRecoilState(editL2Info_logo_input);

  const CandidateAddOn_CONTRACT = useContract(data?.candidateContract, CandidateAddOn);
  
  const { 
    isOperator, 
    bridgeTypes, 
    operatorManager,
    managers,
    claimable
  } = useIsOperator(data?.candidateContract)
  // const isOperator = true

  const lockedInBridge = useL2CandidateInfo(data?.candidateAddOn)
  
  useEffect(() => {
    const infos = L2Info.find((info: any) => info.name === data.name)
    
    if (infos) {
      setBridgeValue(infos.bridge)
      setExplorerValue(infos.explorer)
      setLogoValue(infos.logo)
    }
  }, [L2Info])

  // console.log(data)

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

  const converted = lockedInBridge
    ? convertNumber({
        amount: lockedInBridge,
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
          <Flex flexDir={'row'}>
            <Flex>
              Information
            </Flex>
            <Flex mt={'8px'} ml={'3px'}>
              <BasicTooltip 
                label={'This data is provided by the L2 operator and may not be accurate. Please conduct your own research.'}
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDir={'row'}>
          {
            editStat ? '' :
            <L2InfoContent 
              title={'L2 Rollup Type'} 
              content={
                bridgeTypes === 1 
                ? 'Tokamak Titan'
                : bridgeTypes === 2
                ? 'Tokamak Thanos'
                : 'Unknown'
              } 
              type={'string'} 
            />
          }
          <L2InfoContent title={'Bridge'} content={bridgeValue} type={'bridge'} editStat={editStat} />
          <L2InfoContent title={'Block explorer'} content={explorerValue} type={'explorer'} editStat={editStat} />
          {
            isOperator ?
            <L2InfoContent title={'L2 Logo'} content={logoValue} type={'logo'} editStat={editStat} /> 
            : ''
          }
        </Flex>
      </Flex>
      <Flex flexDir={'column'} my={'54px'}>
        <Flex fontSize={'18px'} fontWeight={500} color={'#2a72e5'} mb={'18px'}>
          <Flex>
            Sequencer seigniorage
          </Flex>
          <Flex mt={'9px'} ml={'5px'}>
            <BasicTooltip 
              label={'a'}
            />
          </Flex>
        </Flex>
        <Flex flexDir={'row'}>
          <L2Content 
            title={'TON bridged to L2'} 
            content={convertLargeNumber(converted)} 
            content2={data?.candidateAddOn.bridge} 
            type={'ton'} 
            isOperator={isOperator}
          />
          {
            isOperator ?
            <Flex alignItems={'end'} mr={'30px'}>
              <Button 
                w={'80px'}
                h={'25px'}
                borderRadius={'4px'}
                border={'solid 1px #2a72e5'}
                bgColor={'#fff'}
                color={'#2a72e5'}
                fontSize={'12px'}
                fontWeight={'normal'}
                _hover={{
                  borderColor: '#2a72e5',
                  color: '#2a72e5'
                }}
              >
                Update
              </Button>
            </Flex>
            : ''
          }
          {
            isOperator ?
            <L2Content
              title={'Claimable seigniorage'}
              content={claimableAmount}
              content2={stakable}
              type={'seig'}
              contractAddress={data?.candidateContract}
              isOperator={isOperator}
            />
            : ''
          }
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
            </Flex> 
           : ''
          }
        </Flex>
      </Flex>
      {/* <ClaimModal /> */}
    </Flex>
  );
}

export default L2Information;
