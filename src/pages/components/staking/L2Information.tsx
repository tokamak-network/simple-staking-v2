import { getDate } from '@/components/getDate';
import { Box, Button, Flex } from '@chakra-ui/react';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import L2Content from './L2Content';
import { convertNumber } from '@/components/number';
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

type L2InformationProps = {
  data: any;
};

function L2Information({ data }: L2InformationProps) {
  const { account, library } = useWeb3React()
  // const {

  // } = data?.candidateAddOn
  const [editStat, setEditStat] = useState(false);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [target, setTarget] = useState('');
  const [name, setName] = useState('');

  const [selectedModal, setSelectedModal] = useRecoilState(modalState);
  const [, setSelectedModalData] = useRecoilState(modalData);
  const [, setTxPending] = useRecoilState(txState);
  const [tx, setTx] = useState();

  console.log(data);

  useEffect(() => {
    if (data) {
      setAddress('')
      setAmount('')
      setTarget('')
    }
  },[data]);

  const dataModal: ClaimModalDataType = {
    amount: amount,
    target: target,
    address: address,
    name: name
  }

  const modalButton = useCallback(async (modalType: ModalType, name: string, data: any) => {
    setName(name)
    setSelectedModal(modalType);
    setSelectedModalData(data);
  }, [dataModal]);

  const [bridgeValue, setBridgeValue] = useRecoilState(editL2Info_bridge_input);
  const [explorerValue, setExplorerValue] = useRecoilState(editL2Info_explorer_input);
  const [logoValue, setLogoValue] = useRecoilState(editL2Info_logo_input);

  
  const CandidateAddOn_CONTRACT = useContract(data?.candidateContract, CandidateAddOn);
  
  const { isOperator, l2Infos, bridgeTypes } = useIsOperator(data?.candidateContract)
  
  useEffect(() => {
    if (l2Infos) {
      setBridgeValue(l2Infos.bridge)
      setExplorerValue(l2Infos.explorer)
      setLogoValue(l2Infos.logo)
    }
  }, [l2Infos])
  
  const layer2Seigs = data?.candidateAddOn.seigGiven[0]
    ? convertNumber({
        amount: data?.candidateAddOn.seigGiven[0].layer2Seigs,
        type: 'ray',
        localeString: true,
      })
    : '0.00';
  
    const l2TotalSeigs = data?.candidateAddOn.seigGiven[0]
    ? convertNumber({
        amount: data?.candidateAddOn.seigGiven[0].l2TotalSeigs,
        type: 'ray',
        localeString: true,
      })
    : '0.00';

  const converted = data?.lockedInBridge
    ? convertNumber({
        amount: data?.lockedInBridge,
        type: 'ray',
        localeString: true,
      })
    : '0.00';
  
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
          <L2InfoContent title={'L2 Logo'} content={data?.name} type={'logo'} editStat={editStat} />
        </Flex>
      </Flex>
      <Flex flexDir={'column'} my={'54px'}>
        <Flex fontSize={'18px'} fontWeight={500} color={'#2a72e5'} mb={'18px'}>
          Sequencer seigniorage
        </Flex>
        <Flex flexDir={'row'}>
          <L2Content title={'TON locked in Bridge'} content={converted} content2={data?.candidateAddOn.bridge} type={'ton'} />
          <L2Content
            title={'Earned seigniorage'}
            content={layer2Seigs}
            content2={l2TotalSeigs}
            type={'seig'}
            contractAddress={data?.candidateContract}
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
