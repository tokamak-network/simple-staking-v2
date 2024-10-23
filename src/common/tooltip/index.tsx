import {
  Tooltip,
  useColorMode,
  PlacementWithLogical,
  Text,
  Flex,
  Link
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { useEffect, useRef, useState } from "react";

type tooltipProps = {
  label: string | undefined;
  placement?: PlacementWithLogical;
  label2?: string | undefined
  types?: string | undefined
  size?: string
};

const BasicTooltip: React.FC<tooltipProps> = (props) => {
  const { colorMode } = useColorMode();
  const { label, label2, placement, types, size } = props;
  // const dropMenuRef = useRef<HTMLDivElement | null>();
  const [isLabelOpen, setIsLabelOpen] = useState(false)

  const tooltipControl = () => {
    !isLabelOpen ? setIsLabelOpen(true) : setIsLabelOpen(false)
  }

  const members = () => {
    return (
      <Text>
        DAO candidates with the most staked TON are eligible to serve as 
        <Link
          href={'https://dao.tokamak.network/#/'}
          rel="noopener noreferrer" 
          target="_blank"
          textDecor={'underline'}
          mx={'3px'}
        >
          DAO committee members 
        </Link>
        and vote on DAO agendas. Currently, there are three members.
      </Text>
    )
  }
  const candidate = () => {
    return (
      <Text>
        An operator 
        <Link
          href={'https://docs.tokamak.network/docs/en/guides/ton-staking/how-to-set-candidate'}
          rel="noopener noreferrer" 
          target="_blank"
          textDecor={'underline'}
          mx={'3px'}
        >
          registered 
        </Link>
        as a DAO candidate who has staked a minimum of 1,000.1 TON (non-withdrawable).
      </Text>
    )
  }

  const tokamakOp = () => {
    
  }

  const plasma = () => {
    return (
      <Text>
        An operator running the Tokamak Network's implementation of 
        <Link
          href={'https://docs.tokamak.network/docs/en/learn/advanced/plasma-evm-architecture'}
          rel="noopener noreferrer" 
          target="_blank"
          textDecor={'underline'}
          mx={'3px'}
        >
          Plasma EVM. 
        </Link>
      </Text>
    )
  }

  const seigRatioInfo = [
    {
      title: 'Staker',
      ratio: '30%',
      formular: 'S/T+0.5*(T-S)',
    },
    {
      title: 'DAO',
      ratio: '20%',
      formular: '0.1*(T-S)',
    },
    {
      title: 'sTOS holder',
      ratio: '50%',
      formular: '0.4*(T-S)',
    },
  ]

  const seigPerDay = () => {
    return (
      <Flex flexDir={'row'} w={'223px'} justifyContent={'space-between'} p={'3px'}>
        {
          seigRatioInfo.map((props: any, index: number) => {
            return (
              <Flex
                key={index}
                fontWeight={500}
                fontSize={'12px'}
                color={'#fff'}
                lineHeight={'16px'}
                flexDir={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                maxWidth={'72px'}
              >
                <Flex>
                  {props.title}
                </Flex>
                <Flex>
                  {props.ratio}
                </Flex>
                <Flex
                  fontSize={'10px'}
                  fontWeight={400}
                  color={'#ccc'}
                >
                  {props.formular}
                </Flex>
              </Flex>
            )
          })
        }
      </Flex>
    )
  }
  
  return (
    <Tooltip
      display={label?.length === 0 ? "none" : "flex"}
      placement={placement ?? "top"}
      pointerEvents={"all"}
      label={
        label === 'member'
          ? members()
          : label === 'candidate'
          ? candidate()
          : label === 'seigPerDay'
          ? seigPerDay()
          : label
      }
      borderRadius={"3px"}
      color={'#fff'}
      fontSize="12px"
      maxW={'230px'}
      px={'10px'}
      py={'6px'}
      bgColor={'#353c48'}
      boxShadow={'0px 4px 4px 0px rgba(0, 0, 0, 0.25)'}
      hasArrow
      isOpen={isLabelOpen}
      onMouseLeave={() => setIsLabelOpen(false)}
        onMouseEnter={() =>  setIsLabelOpen(true)}
      border={'0px'}
    >
      <QuestionOutlineIcon
        display={label?.length === 0 ? "none" : ""}
        h={size ? size : "12px"}
        w={size ? size : "12px"}
        color={'#333'}
        onMouseLeave={() => setIsLabelOpen(false)}
        onMouseEnter={() =>  setIsLabelOpen(true)}
        onClick={() => tooltipControl()}
      />
    </Tooltip>
  );
};

export default BasicTooltip;
