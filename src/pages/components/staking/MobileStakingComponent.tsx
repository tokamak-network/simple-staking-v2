import {
  Button,
  Flex,
  Text,
  useTheme,
  useDisclosure,
  Link,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import Image from "next/image";
import useUserBalance from "@/hooks/useUserBalance";
import { useWeb3React } from "@web3-react/core";
import OperatorImage from "@/common/table/staking/Oval";
import select1_arrow_inactive from "assets/images/select1_arrow_inactive.png";
import icon_close from "assets/images/icon_close.png";
import { useCallback, useEffect, useState } from "react";
import OperatorSelect from "./OperatorSelect";
import MobileCustomInput from "@/common/input/MobileCustomInput";
import { reStaking, staking, unstake, withdraw, wtonStaking } from "@/actions/StakeActions";
import useCallContract from "@/hooks/useCallContract";
import { useRecoilState, useRecoilValue } from "recoil";
import { txState } from "@/atom/global/transaction";
import { convertNumber, floatParser } from "@/components/number";
import MobileInfo from "./MobileInfo";
import { useWithdrawable } from "@/hooks/staking/useWithdrawable";
import { usePendingUnstaked } from "@/hooks/staking/usePendingUnstaked";
import { useExpectedSeig } from "@/hooks/staking/useCalculateExpectedSeig";
import { getContract } from "@/components/getContract";
import Candidate from 'services/abi/Candidate.json';
import { candidateValues } from '@/atom/global/candidateList';

function MobileStakingComponent(props: { 
  operatorList: any 
  title: string
}) {
  const { account, library } = useWeb3React();
  const { 
    operatorList, 
    title
  } = props;

  const { userTonBalance, userWTonBalance } = useUserBalance(account);
  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const index = useRecoilValue(candidateValues)
  const [selectedOp, setSelectedOp] = useState<any>(index ? operatorList?.[index] : operatorList?.[0]);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [amount, setAmount] = useState(0);
  const [tokenType, setTokenType] = useState('TON')
  const [minimumAmount, setMinimumAmount] = useState<boolean>();
  const [txPending, setTxPending] = useRecoilState(txState);
  const [tx, setTx] = useState();
  const { withdrawable, withdrawableLength } = useWithdrawable(selectedOp?.candidateContract)
  const { pendingUnstaked } = usePendingUnstaked(selectedOp?.candidateContract, account);

  const { TON_CONTRACT, WTON_CONTRACT, DepositManager_CONTRACT } = useCallContract();

  const tonB = userTonBalance ? floatParser(userTonBalance): 0
  const wtonB = userWTonBalance ? floatParser(userWTonBalance) : 0
  const expectedSeig = useExpectedSeig(selectedOp?.candidateContract, selectedOp?.stakedAmount, selectedOp?.candidate)
  
  const candidateAmount = selectedOp?.stakeOfCandidate ? convertNumber({
    amount: selectedOp?.stakeOfCandidate,
    type: 'ray'
  }) : '0.00'

  useEffect(() => {
    setMinimumAmount(Number(candidateAmount) > 1000)

  }, [account, candidateAmount])

  const userExpectedSeig = expectedSeig? convertNumber({
    amount: expectedSeig,
    type: 'ray',
    localeString: true
  }) : '0.00'

  useEffect(() => {
    setSelectedOp(index? operatorList[index] : operatorList[0])
  }, [operatorList, index])

  const updateSeig = useCallback(async () => {
    if (account && library) {
      try {
        const Candidate_CONTRACT = getContract(
          selectedOp?.candidateContract, 
          Candidate.abi, 
          library, 
          account
        )
        const tx = await Candidate_CONTRACT.updateSeigniorage()
        setTx(tx);
        setTxPending(true);
      } catch (e) {
        console.log(e)
        setTxPending(false);
        setTx(undefined);
      }
    }
  }, [account, library, selectedOp])
  
  useEffect(() => {
    let disable = true
    if (selectedOp) {
      if (title === 'Stake') {
        disable = (
          userTonBalance === "0.00" ||
          userWTonBalance === "0.00" ||
          amount === 0 ||
          Number.isNaN(amount) ||
          amount === undefined  || 
          (tonB && tokenType === 'TON' && amount > tonB ? true : false) || 
          (wtonB && tokenType === 'WTON' && amount > wtonB ? true : false) ||
          !minimumAmount
        )
      } else if (title === 'Unstake') {
        disable = (staked ?  amount > Number(staked) : false) || amount === 0 || Number.isNaN(amount) || amount === undefined
      } else if (title === 'Restake') {
        disable = pendingUnstaked === "0.00"
      } else {
        disable = withdrawable === '0.00' || selectedOp === undefined
      }
    }
    setDisabled(disable)
  }, [title, amount, tokenType, minimumAmount])
  
  const staked = selectedOp?.stakeOf ?
    convertNumber({
      amount: selectedOp?.stakeOf,
      type: 'ray',
      localeString: true
    }) : '0.00'

  return (
    <Flex w="100%" px="20px" flexDir={'column'}>
      <Flex
        w="100%"
        // h="205px"
        border={"1px solid #e7ebf2"}
        borderRadius="10px"
        pt="10px"
        pb="15px"
        px="20px"
        flexDir={"column"}
      >
        <Flex alignItems={"center"} h="35px">
          <Text color="gray.300" fontSize={"12px"} mr={'5px'}>
            {
              title === 'Withdraw' 
              ? 'Withdrawable Amount:' 
              : title === 'Restake' 
              ? 'Restakable Balance:'
              : title === 'Unstake' 
              ? 'Unstakable Balance:'
              : 'Balance:'
            }
          </Text>
          {
            title === 'Withdraw' ? '' :
            <Flex>
              <Text fontSize={"13px"} color="gray.700">
                {
                  title === 'Stake' ?
                  userTonBalance :
                  title === 'Unstake' ?
                  staked :
                  pendingUnstaked
                } TON
              </Text>
              {
                title === 'Stake' ?
                <Text 
                  fontSize={"13px"} 
                  color="gray.700"
                  ml={'3px'}
                >
                  {`/ ${userWTonBalance}`} WTON
                </Text> : ''
              }

            </Flex>
          }
        </Flex>
        {
          title === 'Restake' ?
          (
            <Flex
              border={"solid 1px #dfe4ee"}
              borderRadius="4px"
              h="40px"
              alignItems="center"
              px="10px"
              fontSize={"13px"}
              justifyContent={'space-between'}
            >
              <Text fontSize={"13px"}>
                
              </Text>
              <Flex>
                <Text textAlign={"right"}>
                  {pendingUnstaked}
                </Text>
                <Text fontSize={"13px"} ml="7px">
                  TON
                </Text>
              </Flex>
            </Flex>
          ) : 
          title === 'Withdraw' ?
          (
            <Flex
              h="40px"
              justifyContent={"flex-end"}
              borderRadius="4px"
              bg="gray.200"
              border="solid 1px #dfe4ee"
              alignItems={'center'}
              px='10px'
            >
              <Text fontSize={'13px'}>{`${withdrawable} ${tokenType}`} </Text>
            </Flex>
          ) : (
            <MobileCustomInput
              w={"147px"}
              placeHolder={"0.00"}
              type={title}
              maxValue={
                title === 'Stake' && tokenType === 'TON' 
                ? userTonBalance 
                : title === 'Stake' && tokenType === 'WTON'  
                ? userWTonBalance
                : staked
              }
              setAmount={setAmount}
              setTokenType={setTokenType}
              tokenType={tokenType}
              maxButton={true}
            />
          )
        }
        
        <Flex
          mt="10px"
          h="40px"
          borderRadius={"4px"}
          border="solid 1px #dfe4ee"
          justifyContent={"space-between"}
          alignItems="center"
          px="10px"
        >
          <Text fontSize={"12px"}>Select an operator</Text>
          <Flex alignItems={"center"}>
            <OperatorImage height="20px" width="20px" />
            <Text ml="7px" fontSize={"13px"} fontWeight="bold">
              {selectedOp?.name}
            </Text>
            <Flex height={"9px"} width={"8px"} ml="10px" onClick={onOpen}>
              <Image
                src={select1_arrow_inactive}
                alt={"select1_arrow_inactive"}
              />
            </Flex>
          </Flex>
        </Flex>
        {
          title === 'Withdraw' ?
          <Flex
            flexDir={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            h={'43px'}
          >
            <Flex
              fontSize={'12px'}
              fontWeight={'normal'}
              color={'#808992'}
              alignItems={'center'}
              mt={'5px'}
            >
              Withdraw as
            </Flex>
            <RadioGroup
              onChange={(value: 'TON' | 'WTON') => setTokenType(value)} 
              value={tokenType}
            >
              <Flex alignItems={'row'} mt={'11px'} justifyContent={'center'}>
                <Radio
                  value="TON"
                  h={'20px'}
                  mr={'6px'}
                  bgColor={'#fff'}
                  border={'solid 2px #c6cbd9'}
                  isChecked={true}
                >
                  <Flex
                    fontSize={'13px'}
                    fontWeight={500}
                    color={'#3d495d'}
                    flexDir={'row'}
                    alignItems={'center'}
                  >
                    TON 
                  </Flex>
                </Radio>
                <Radio
                  value="WTON"
                  h={'20px'}
                  mr={'6px'}
                  bgColor={'#fff'}
                  border={'solid 2px #c6cbd9'}
                  isChecked={false}
                >
                  <Flex
                    fontSize={'13px'}
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
        <Button
          mt="15px"
          bg="blue.200"
          color={"white.100"}
          _focus={{
            bg: "blue.200",
          }}
          _active={{
            bg: "blue.200",
          }}
          _hover={{
            bg: "blue.200",
          }}
          isDisabled={disabled}
          _disabled={{ bg: "#86929d", color: "#e9edf1" }}
          onClick={() =>
            title === 'Stake' && tokenType === 'TON' ?
              staking(
                userTonBalance,
                TON_CONTRACT,
                amount,
                selectedOp.candidateContract,
                setTxPending,
                setTx
              ) :
            title === 'Stake' && tokenType === 'WTON' ?
              staking(
                userWTonBalance,
                WTON_CONTRACT,
                amount,
                selectedOp.candidateContract,
                setTxPending,
                setTx
              ) :
            title === 'Unstake' ?
              unstake(account, selectedOp.candidateContract, DepositManager_CONTRACT, setTxPending, setTx, amount) :
            title === 'Restake' ?
              reStaking(
                account,
                DepositManager_CONTRACT,
                selectedOp.candidateContract,
                setTxPending,
                setTx
              ) :
              withdraw(
                account, 
                selectedOp.candidateContract, 
                DepositManager_CONTRACT,
                withdrawableLength, 
                tokenType === 'TON' ? true : false,
                setTxPending, 
                setTx
              )
          }
        >
          {title}
        </Button>
        {
          title === 'Stake' && !minimumAmount ?
          <Text
            fontSize={'12px'}
            color={'#ff2d78'}
            flexDir={'row'}
            mt={'15px'}
            textAlign={'center'}
          >
            <Link
              mr={'3px'}
              href={'#'}
              color="#ff2d78"
              textDecor={'none'}
            >
              Warning: The
            </Link>
            <Link
              color={'#2a72e5'}
              mx={'3px'}
              // href={`https://etherscan.io/address/${selectedOp.candidateContract}`}
              isExternal
            >
              operator
            </Link>
            is required to stake at least
            <Link
              isExternal
              href={'https://medium.com/onther-tech/staking-on-tokamak-network-a5cca48bea3d#:~:text=Become%20a%20direct%20Operator%20in%20the%20Tokamak%20Network%20by%20operating%20a%20new%20blockchain.%20In%20order%20to%20operate%20a%20chain%2C%20at%20least%201%2C000.1%20TON%20must%20be%20deposited%20(posting%20updated%20on%202024.1.22)'}
              color={'#2a72e5'}
              mx={'3px'}
            >
              1,000.1 TON
            </Link>
            on this layer2 before stakers can receive the staking reward. Users are unable to stake until this minimum collateral requirement is fulfilled.
          </Text>
          : title === 'Stake' && minimumAmount ?
          <Flex
            fontSize={'12px'}
            color={'#3e495c'}
            flexDir={'row'}
            mt={'15px'}
            
          >
            Recommended minimum staking amount is 
              <Text
                ml={'3px'}
                color="#2a72e5"
              >
                5 TON
              </Text>
          </Flex>
          : title === 'Restake' ? 
          <Text
            fontSize={'12px'}
            color={'#3e495c'}
            flexDir={'row'}
            mt={'15px'}
            textAlign={'center'}
          >
            <Link
              mr={'3px'}
              href={'#'}
              color="#ff2d78"
              textDecor={'none'}
            >
              Warning
            </Link>
            : Restaking will stake unstaked TON, and these cannot be withdrawn until they are unstaked again.
          </Text>
          : title === 'Unstake' ?
          <Text
          fontSize={'12px'}
          color={'#3e495c'}
          flexDir={'row'}
          mt={'15px'}
          textAlign={'center'}
        >
          <Link
            mr={'3px'}
            href={'#'}
            color="#ff2d78"
            textDecor={'none'}
          >
            Warning
          </Link>
          : You can withdraw unstaked TON to your wallet 14 days after unstaking.
        </Text>
          : ''
        }
      </Flex>
      {
        account ?
        <Flex flexDir={'column'}>
          <MobileInfo 
            title={'Your Staked'}
            value={selectedOp?.stakeOf}
          /> 
          <MobileInfo 
            title={'Unclaimed Staking Reward'}
            value={minimumAmount ? expectedSeig : '-'}
          />
        </Flex>
          : '' 
      }
      {
        // !minimumAmount && account ?
        // (
        //   <Text
        //   fontSize={'12px'}
        //   color={'#ff2d78'}
        //   mt={'3px'}
        //   textAlign={'right'}
        //   // w={'250px'}
        // >
        //   <Link
        //     mr={'3px'}
        //     href={'#'}
        //     color="#ff2d78"
        //     textDecor={'none'}
        //   >
        //     Warning: The
        //   </Link>
        //   <Link
        //     color={'#2a72e5'}
        //     mx={'3px'}
        //     // href={`https://etherscan.io/address/${selectedOp.candidateContract}`}
        //     isExternal
        //   >
        //     operator
        //   </Link>
        //   is required to stake at least
        //   <Link
        //     isExternal
        //     href={'https://medium.com/onther-tech/staking-on-tokamak-network-a5cca48bea3d#:~:text=Become%20a%20direct%20Operator%20in%20the%20Tokamak%20Network%20by%20operating%20a%20new%20blockchain.%20In%20order%20to%20operate%20a%20chain%2C%20at%20least%201%2C000.1%20TON%20must%20be%20deposited%20(posting%20updated%20on%202024.1.22)'}
        //     color={'#2a72e5'}
        //     mx={'3px'}
        //   >
        //     1,000.1 TON
        //   </Link>
        //   on this layer2 before stakers can receive the staking reward. Users are unable to stake until this minimum collateral requirement is fulfilled.
        // </Text>
        // ) : 
        userExpectedSeig && userExpectedSeig !== '0.00' ?
        <Flex
          fontSize={'11px'}
          color={'#2a72e5'}
          cursor={'pointer'}
          justifyContent={'end'}
          mt={'12px'}
          onClick={()=> updateSeig()}
        >
          Add to Your Staked
        </Flex> :
        ''
      }
      <OperatorSelect
        operatorList={operatorList}
        onClose={onClose}
        isOpen={isOpen}
        setSelectedOp={setSelectedOp}
      />
    </Flex>
  );
}

export default MobileStakingComponent;
