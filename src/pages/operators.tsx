import { Box, Flex, Text, useTheme, Button, Spinner } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import OperatorCard from "./components/operators/OperatorCard";
import { useCandidateList } from '../hooks/staking/useCandidateList';
import { useStakingInformation } from "@/hooks/staking/useStakingInformation";
import { StakingInformationTooltip } from "@/common/tooltip/StakingInformationTooltip";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";

function Operators() {
  const theme = useTheme();
  const { candidateList } = useCandidateList();
  const { stakingInfo } = useStakingInformation(candidateList);
  const router = useRouter();

  const [width] = useWindowDimensions();
  const mobile = width && width < 1040;

  useEffect(() => {
    if (width && width > 1040) router.push("/staking");
  }, [width]);

  return (
    <Flex
      w="100%"
      height={"100%"}
      pt="30px"
      alignItems={"center"}
      flexDir="column"
    >
      <Text
        fontSize={"24px"}
        fontWeight={"bold"}
        fontFamily={theme.fonts.roboto}
        color="gray.700"
        mb="5px"
      >
        DAO Candidates
      </Text>
      <Text
        fontSize={"12px"}
        textAlign="center"
        mt="5px"
        mb="30px"
        w="250px"
        color={"gray.300"}
      >
        Stake your TON with a DAO candidate to earn seigniorage rewards while delegating your voting power to help shape Tokamak Network's governance.
      </Text>
      <Flex justifyContent={'center'}>
          <Flex flexDir={'column'} minW={'290px'} justifyContent={'space-between'} mb={'60px'}>
            {
              stakingInfo.map((info: any, index: number) => {
                const {
                  title,
                  tooltip,
                  value,
                  unit
                } = info
                return (
                  <StakingInformationTooltip
                    key={index}
                    title={title}
                    tooltip={tooltip}
                    value={value}
                    unit={unit}
                  />
                )
              })
            }

          </Flex>
        </Flex>
      <Flex w="100%" px="20px" flexDir={"column"}>
        {candidateList.length !== 0 ? (
          candidateList.map((operator: any, index: number) => {
            return <OperatorCard operator={operator} key={index} />
          })
        ) : (
          <Flex justifyContent="center" alignItems={"center"} h='200px'>
            <Spinner size="md" emptyColor="gray.200" color="#2775ff" />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

export default Operators;