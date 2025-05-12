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
import { 
  editL2Info_bridge_input, 
  editL2Info_chainId_input, 
  editL2Info_explorer_input, 
  editL2Info_logo_input,
  editL2Info_rpc_input, 
} from '@/atom/staking/editL2Info';
import { useWeb3React } from '@web3-react/core';
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
  const [editStat, setEditStat] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [target, setTarget] = useState('');
  const [address, setAddress] = useState('');
  const [layerName, setLayerName] = useState('');

  const [selectedModal, setSelectedModal] = useRecoilState(modalState);
  const [, setSelectedModalData] = useRecoilState(modalData);
  const [txPending, ] = useRecoilState(txState);
  // const [tx, setTx] = useState();
  const [claimableAmount, setClaimableAmount] = useState<string | undefined>('0.00');

  const [bridgeValue, setBridgeValue] = useRecoilState(editL2Info_bridge_input);
  const [explorerValue, setExplorerValue] = useRecoilState(editL2Info_explorer_input);
  const [chainIdValue, setChainIdValue] = useRecoilState(editL2Info_chainId_input);
  const [logoValue, setLogoValue] = useRecoilState(editL2Info_logo_input);
  const [rpcValue, setRpcValue] = useRecoilState(editL2Info_rpc_input);
  
  const { 
    isOperator, 
    bridgeTypes, 
    operatorManager,
    managers,
    claimable,
    rollupConfigInfo
  } = useIsOperator(data?.candidateContract)
  // const isOperator = true

  const lockedInBridge = useL2CandidateInfo(data?.candidateAddOn)
  
  useEffect(() => {
    const infos = L2Info.find((info: any) => info.name === data.name)
    
    if (infos) {
      setBridgeValue(infos.bridge)
      setExplorerValue(infos.explorer)
      setLogoValue(infos.logo)
      setChainIdValue(infos.chainId.toString())
      setRpcValue(infos.rpc)
    }
  }, [L2Info])

  useEffect(() => {
    if (data) {
      setContractAddress(data.candidateContract)
      setAmount('')
      setAddress(managers)
      setTarget(operatorManager)
      setLayerName(data.name)
    }
  },[data, managers, operatorManager]);

  const { expectedSeig } = useExpectedSeig(data?.candidateContract, data?.stakedAmount, data?.candidate)
  
  const expectedSeigs = expectedSeig
    ? convertNumber({
        amount: expectedSeig,
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
  const stakableAmount = floatParser(claimableAmount) + floatParser(expectedSeigs) 
  const stakable = stakableAmount.toLocaleString(undefined,{maximumFractionDigits: 2})

  // console.log(data?.name, rollupConfigInfo, typeof rollupConfigInfo)
  // useEffect(() => {}, [rollupConfigInfo]);

  useEffect(() => {
    const claim = claimable
        ? convertNumber({
          amount: claimable,
          type: 'ray',
          localeString: true,
        })
    : '0.00'   
    setClaimableAmount(claim);
  }, [claimable, expectedSeigs, txPending]);

  const dataModal: ClaimModalDataType = {
    amount: amount,
    target: target,
    address: address,
    name: '',
    contractAddress: contractAddress,
    claimable: claimableAmount ? claimableAmount : '0.00',
    expectedSeigs: expectedSeigs ? expectedSeigs : '0.00',
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

  const chainIdHex = useMemo(() => {
    try {
      return '0x' + Number(chainIdValue).toString(16);
    } catch {
      return undefined;
    }
  }, [chainIdValue]);

  // 2) addNetwork function
  const handleAddNetwork = useCallback(async () => {
    if (!(window as any).ethereum || !chainIdHex) {
      console.error('No Ethereum provider found or invalid chainId');
      return;
    }
    try {
      await (window as any).ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: chainIdHex,
          chainName: layerName || `L2 ${chainIdValue}`,
          nativeCurrency: {
            name: 'TON',
            symbol: 'TON',
            decimals: 18
          },
          rpcUrls: [rpcValue],
          blockExplorerUrls: [explorerValue]
        }]
      });
    } catch (error) {
      console.error('Failed to add network:', error);
    }
  }, [chainIdHex, rpcValue, explorerValue, layerName, chainIdValue]);
  
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
          <L2InfoContent title={'Chain Id'} content={chainIdValue} type={'string'} editStat={editStat} />
          <Flex
            fontSize={'11px'}
            color={'#2a72e5'}
            cursor={'pointer'}
            minW={'80px'}
            mt={'30px'}
            onClick={() => handleAddNetwork()}
          >
            Add network
          </Flex>
          {/* {
            isOperator ?
            <L2InfoContent title={'L2 Logo'} content={logoValue} type={'logo'} editStat={editStat} /> 
            : ''
          } */}
        </Flex>
      </Flex>
      <Flex flexDir={'column'} my={'54px'}>
        <Flex fontSize={'18px'} fontWeight={500} color={'#2a72e5'} mb={'18px'}>
          <Flex>
            Sequencer seigniorage
          </Flex>
          <Flex mt={'9px'} ml={'5px'}>
            <BasicTooltip 
              label={'Sequencer seigniorage represents the portion of newly issued TON that the L2 operator can claim as a reward. This reward increases with the growth of L2 deposits and helps incentivize both the expansion and security of the network.'}
            />
          </Flex>
          {
            Number(rollupConfigInfo) === 2 ?
            <Flex color={'#3e495c'} fontSize={'12px'} fontWeight={500} textAlign={'center'} alignItems={'center'} ml={'10px'}>
              <span style={{ color: '#ff2d78' }}>Warning</span>: This layer has stopped the l2 sequencer seigniorage.  
            </Flex>
            : ''
          }
        </Flex>
        <Flex flexDir={'row'}>
          <L2Content 
            title={'TON bridged to L2'} 
            content={convertLargeNumber(converted)} 
            content2={data?.candidateAddOn.bridge} 
            type={'ton'} 
            isOperator={isOperator}
          />
          {/* {
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
          } */}
          <L2Content
            title={'Claimable seigniorage'}
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
            </Flex> 
           : ''
          }
        </Flex>
      </Flex>
      <ClaimModal />
    </Flex>
  );
}

export default L2Information;
