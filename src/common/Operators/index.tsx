import { FC, useEffect, useRef, useState } from "react";
import {
  chakra,
  Text,
  Flex,
  Box,
  useTheme,
} from '@chakra-ui/react';
import { convertNumber } from '@/utils/number';
import { getCircle } from '@/common/table/staking/Circle';
import { OperatorImage } from '@/common/table/staking/Oval';
import RenderBtn from '@/common/table/staking/RenderBTN';
import { Info } from '@/common/table/staking/OperatorInfo';
import { useRecoilState, useRecoilValue } from 'recoil';
import { toggleState } from '@/atom/staking/toggle';
import { useUserStaked } from '@/hooks/staking/useUserStaked';
import { useWeb3React } from '@web3-react/core';
import { useExpectedSeig } from '@/hooks/staking/useCalculateExpectedSeig';
import BasicTooltip from '@/common/tooltip/index';
import { useRouter } from "next/router";
import { useChangedMembers } from "@/hooks/staking/useChangedMembers";
import { useL2CandidateInfo } from "@/hooks/staking/useL2CandidateInfo";
import { useIsOperator } from "@/hooks/staking/useIsOperator";
import { InfoTypeSelector } from "../selector/InfoType";
import ContractAddressInfo from "../table/staking/ContractAddressInfo";


type OpearatorInfoProps = {
  data: any;
  renderDetail: Function;
  renderL2: Function;
  isLoading: boolean;
  key: number
};

export const OpearatorInfos: FC<OpearatorInfoProps> = ({
  data,
  renderDetail,
  renderL2,
  isLoading,
  key
}) => {
  const focusTarget = useRef<any>([]);
  const router = useRouter();
  const { asPath } = router;

  const { 
    candidateContract, 
    stakedAmount, 
    candidate, 
    candidateAddOn, 
    stakeOfCandidate, 
    commissionRate, 
    stakeOf,
    kind,
    name
  } = data;
  const { account } = useWeb3React();

  const [isOpen, setIsOpen] = useState('');
  const [tab, setTab] = useState('staking')
  // const [members, setMembers] = useState()
  const [toggle, setToggle] = useRecoilState(toggleState)

  const { memberAddresses } = useChangedMembers()

  useEffect(() => {
    if (asPath.includes('#')) {
      const indexOf = asPath.indexOf('#')
    //   const dataIndex = page.findIndex((candidateData: any) => candidateData.original.id === asPath.slice(indexOf + 1))

    //   setIsOpen(asPath.slice(9));
    //   setToggle('All')
    //   setTimeout(() => {
    //   focusTarget?.current[dataIndex]?.scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'start',
    //   });
    // }, 100);
    }
  }, [])

  const stakedId = candidateContract

  const [logo, setLogo] = useState<string>('')
  const { l2Infos } = useIsOperator(candidateAddOn?.id)
  
  useEffect(() => {
    if (l2Infos) {
      setLogo(l2Infos.logo)
    }
  }, [l2Infos])

  const clickOpen = (candidateContract: string, index: number) => {
    setIsOpen(candidateContract);
    setToggle('All')
    setTab('staking')
    setTimeout(() => {
      focusTarget?.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };
  
  const candidateAmount = stakeOfCandidate? convertNumber({
    amount: stakeOfCandidate,
    type: 'ray'
  }) : '0.00'

  const minimumAmount = Number(candidateAmount) >= 1000
  const isMember = memberAddresses?.find((address: any) => address.member === candidate)
  
  const rate = commissionRate ? convertNumber({
    amount: commissionRate,
    type: 'wei',
    // localeString: true
  }) : '0.00'

  const totalStaked = convertNumber({
    amount: stakedAmount, 
    type: 'ray',
    localeString: true
  })

  const yourStaked = stakeOf ? convertNumber({
    //@ts-ignore
    amount: stakeOf, 
    type: 'ray',
    localeString: true
  }) : '0.00'

  return (
    <Flex
      flexDir={'column'}
    >
      <Flex 
        overflowX={'auto'} 
        ref={(el) => (focusTarget.current[key] = el)}
        h={'74px'}
        key={key}
        onClick={() => {
          if (isOpen === candidateContract) {
            setIsOpen('');
          } else {
            clickOpen(candidateContract, key);
          }
        }}
        cursor={'pointer'}
        borderRadius={'10px'}
        borderBottomRadius={
          isOpen === candidateContract ? '0px' : '10px'
        }
        borderBottom={isOpen === candidateContract ? 'solid 2px #f4f6f8' : ''}
        borderBottomColor={
          isOpen === candidateContract ? '#f4f6f8' : ''
        }
        px={'16px'}
        mb={'15px'}
        w="100%"
        bg={'white.100' }
        border={''}
        alignItems="center"
        justifyContent={'space-between'}
        flexDir={'row'}
      >
        <Flex alignItems="center">
          <Flex 
            alignItems={'center'} 
            mr={'30px'} 
            w={'300px'}
            fontWeight={500}
            fontSize={'20px'}
          >
            <Flex 
              flexDir={'column'} 
              justifyContent={isMember ? 'space-between' : 'center'} 
              h={'25px'}
              w={'18px'}
              
            >
              {minimumAmount ? getCircle(kind) : ''}
              {isMember ? getCircle('member') : ''}
            </Flex>
            <Box mr={'12px'}>
              <OperatorImage imageLink={logo}/>
            </Box>
            <Text 
              // w={'176px'} 
              color={'#304156'} 
              fontWeight={500}
            >
              {name}
            </Text>
            {
              candidateAddOn !== null ?
              <Flex
                w={'34px'}
                h={'18px'}
                bgColor={'#257eee'}
                fontSize={'12px'}
                color={'#fff'}
                borderRadius={'3px'}
                justifyContent={'center'}
                ml={'9px'}
              >
                L2
              </Flex>
              : ''
            }
          </Flex>
          <Info 
            title={'Total Staked'}
            value={totalStaked}
            unit={'TON'}
          />
          {
            rate ?
            <Info 
              title={'Commission Rate'}
              value={+rate / 10000000}
              unit={'%'}
            /> : ''
          }
          {
            (yourStaked !== '0.00' && yourStaked) ?
            <Info 
              title={'Your Staked'}
              value={yourStaked}
              unit={'TON'}
            /> : ''
          }
        </Flex>
        <RenderBtn
          layer2={candidateContract}
          isOpen={isOpen}
        />
      </Flex>
      {
        isOpen === candidateContract ? (
          <Flex
            boxShadow="0 1px 1px 0 rgba(96, 97, 112, 0.16)"
            // h={'650px'}
            key={key}
            m={0}
            mb={'14px'}
            mt={-5}
            bg={'white.100'}
            borderTop={'1px'}
            borderTopColor={'#f4f6f8'}
            // borderTopWidth={0}
            borderBottomRadius="10px"
          >
            <Flex flexDir={'column'}>
              <Flex flexDir={'row'} minW={'1000px'} justifyContent={'space-between'}>
                {
                  candidateAddOn !== null ?
                  (
                    <InfoTypeSelector 
                      tab={tab}
                      setTab={setTab}
                    />
                  ) : ''
                }
                {
                    tab == 'l2' && candidateAddOn !== null ?
                    <Flex 
                      justifyContent={'center'}
                      alignItems={'center'}
                      fontSize={'13px'}
                      fontWeight={500}
                      color={'#304156'}
                    >
                      <Flex mr={'6px'}>
                        L1 Contract address
                      </Flex>
                      <ContractAddressInfo 
                        label={candidateAddOn}
                      />
                    </Flex> : ''
                  }
              </Flex>
              {
                tab === 'l2' && candidateAddOn !== null ? 
                renderL2({data}) :
                renderDetail({data}) 
              }

            </Flex>
          </Flex>
        ) : ('')
      }
    </Flex>
  ) 
}

export default OpearatorInfos