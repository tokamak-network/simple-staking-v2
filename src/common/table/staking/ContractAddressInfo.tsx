import {
  Tooltip,
  useColorMode,
  PlacementWithLogical,
  Text,
  Flex,
  Link
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { useState } from "react";
import LIST from '@/assets/images/list.svg'
import CLOSE from '@/assets/images/popup_close_s_icon.svg'
import Image from 'next/image';
import { L1ContractInfo } from "./L1ContractInfo";

type tooltipProps = {
  label: any;
};

const ContractAddressInfo: React.FC<tooltipProps> = (props) => {
  const { label } = props;
  const [isLabelOpen, setIsLabelOpen] = useState(false)
  const tooltipControl = () => {
    !isLabelOpen ? setIsLabelOpen(true) : setIsLabelOpen(false)
  }
  
  return (
    <Tooltip
      display={label?.length === 0 ? "none" : "flex"}
      placement={"bottom"}
      pointerEvents={"all"}
      label={
        <Flex 
          flexDir={'row'}
          justifyContent={'space-between'}
          w={'210px'}
          h={'212px'}
        >
          <Flex flexDir={'column'}>
            <L1ContractInfo 
              title={'L2 txn data'}
              content={label.txData}
            />
            <Flex />
            <L1ContractInfo 
              title={'L2 state root'}
              content={label.stateRoot}
            />
            <L1ContractInfo 
              title={'Bridge'}
              content={label.bridge}
            />
          </Flex>
          <Flex 
            justifyContent={'start'} 
            alignItems={'start'} 
            mt={'15px'}
            cursor={'pointer'}
            onClick={() => setIsLabelOpen(false)}
          >
            <Image src={CLOSE} alt={''} />
          </Flex>
        </Flex>
      }
      bg={"#fff"}
      borderRadius={"15px"}
      color={"#3d495c"}
      fontSize="16px"
      h={'210px'}
      maxW={'210px'}
      mr={'120px'}
      px={'15px'}
      bgColor={'#fff'}
      boxShadow={'0 2px 6px 0 rgba(61, 73, 93, 0.1)'}
      isOpen={isLabelOpen}
      border={'0px'}
    >
      <Flex
        display={label?.length === 0 ? "none" : ""}
        h={"20px"}
        w={"20px"}
        color={'#333'}
        onClick={() => tooltipControl()}
      >
        <Image src={LIST} alt={''} />
      </Flex>
    </Tooltip>
  );
};

export default ContractAddressInfo;
