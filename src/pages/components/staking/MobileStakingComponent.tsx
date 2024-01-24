import {
  Button,
  Flex,
  Text,
  useTheme,
  useDisclosure,
  Link,
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
import { reStaking, staking, unstake, withdraw } from "@/actions/StakeActions";
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

function MobileStakingComponent(props: { 
  operatorList: any 
  title: string
}) {
  const { account, library } = useWeb3React();
  const { 
    operatorList, 
    title
  } = props;
  const { userTonBalance } = useUserBalance(account);
  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOp, setSelectedOp] = useState<any>(operatorList?.[0]);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [amount, setAmount] = useState(0);
  const [txPending, setTxPending] = useRecoilState(txState);
  const [tx, setTx] = useState();
  const { withdrawable, withdrawableLength } = useWithdrawable(selectedOp?.candidateContract)
  const { pendingUnstaked } = usePendingUnstaked(selectedOp?.candidateContract, account);

  const { TON_CONTRACT, WTON_CONTRACT, DepositManager_CONTRACT } = useCallContract();

  const tonB = userTonBalance? floatParser(userTonBalance): 0
  const expectedSeig = useExpectedSeig(selectedOp?.candidateContract)

  const updateSeig = useCallback(async () => {
    if (account && library) {
      const Candidate_CONTRACT = getContract(selectedOp?.candidateContract, Candidate.abi, library, account)
      const tx = await Candidate_CONTRACT.updateSeigniorage()
      setTx(tx);
      setTxPending(true);
    }
  }, [])
  
  useEffect(() => {
    let disable = true
    if (title === 'Stake') {
      disable = 
        userTonBalance === "0.00" ||
        amount === 0 ||
        Number.isNaN(amount) ||
        amount === undefined  || (tonB?  amount > tonB: false)
    } else if (title === 'Unstake') {
      disable = (staked ?  amount > Number(staked) : false) || amount === 0 || Number.isNaN(amount) ||amount === undefined
    } else if (title === 'Re-Stake') {
      disable = pendingUnstaked === "0.00"
    } else {
      disable = withdrawable === '0.00' || selectedOp === undefined
    }
    setDisabled(disable)
  }, [title, amount])
  
  const staked = selectedOp ?
    convertNumber({
      amount: selectedOp.stakeOf,
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
            {title === 'Withdraw' ? 'Withdrawable Amount:' : 'Balance:'}
          </Text>
          {
            title === 'Withdraw' ? '' :
              <Text fontSize={"13px"} color="gray.700">
                {
                  title === 'Stake' ?
                  userTonBalance :
                  title === 'Unstake' ?
                  staked :
                  pendingUnstaked
                } TON
              </Text>
          }
        </Flex>
        {
          title === 'Re-Stake' ?
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
                Re-stake Amount
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
                <Text fontSize={'13px'}>{withdrawable} TON</Text>
            </Flex>
          ) : (
            <MobileCustomInput
              w={"147px"}
              placeHolder={"0.00"}
              type={'staking'}
              maxValue={title === 'Stake' ? userTonBalance : staked}
              setAmount={setAmount}
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
            title === 'Stake' ?
              staking(
                userTonBalance,
                TON_CONTRACT,
                amount,
                selectedOp.candidateContract,
                setTxPending,
                setTx
              ) :
            title === 'Unstake' ?
              unstake(account, selectedOp.candidateContract, DepositManager_CONTRACT, setTxPending, setTx, amount) :
            title === 'Re-Stake' ?
              reStaking(
                account,
                DepositManager_CONTRACT,
                selectedOp.candidateContract,
                setTxPending,
                setTx
              ) :
              withdraw(account, selectedOp.candidateContract, DepositManager_CONTRACT,withdrawableLength, setTxPending, setTx)
          }
        >
          {title}
        </Button>
        {
          title === 'Stake' && selectedOp?.name !== 'Talken' ?
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
          : title === 'Stake' && selectedOp?.name === 'Talken' ?
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
              Warning: 
            </Link>
            operator have not met the minimum staked balance requirement (at least 1,000.1 TON). As a result, there will be
            <Link
              ml={'3px'}
              color="#2a72e5"
              textDecor={'none'}
              href={'#'}
            >
              no staking reward 
            </Link>
            for staking on this layer2.
          </Text>
          :''
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
            value={expectedSeig}
          />
        </Flex>
          : '' 
      }
      {
        selectedOp?.name === 'Talken' ?
        (
          <Text
          fontSize={'12px'}
          color={'#ff2d78'}
          mt={'3px'}
          textAlign={'center'}
          // w={'250px'}
        >
          <Link
            isExternal
            href={'https://etherscan.io/address/0xcc2f386adca481a00d614d5aa77a30984f264a07'}
            color={'#2a72e5'}
            textDecor={'underline'}
            mr={'3px'}
          >
            Operator
          </Link>  
          must stake at least 
          <Link
            isExternal
            href={'https://medium.com/onther-tech/staking-on-tokamak-network-a5cca48bea3d#:~:text=Become%20a%20direct%20Operator%20in%20the%20Tokamak%20Network%20by%20operating%20a%20new%20blockchain.%20In%20order%20to%20operate%20a%20chain%2C%20at%20least%201%2C000.1%20TON%20must%20be%20deposited%20(posting%20updated%20on%202024.1.22)'}
            mx={'3px'}
            color={'#2a72e5'}
            textDecor={'underline'}
          >
            1,000.1 TON 
          </Link>
          for stakers to receive a staking reward. This operator is managed by 
          <Link
            isExternal
            href={'https://talken.io/'}
            color={'#2a72e5'}
            textDecor={'underline'}
            ml={'3px'}
          >
            Talken.
          </Link>
        </Text>
        ) : 
        expectedSeig && expectedSeig !== '0' ?
        <Flex
          fontSize={'11px'}
          color={'#2a72e5'}
          cursor={'pointer'}
          justifyContent={'end'}
          mt={'10px'}
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
