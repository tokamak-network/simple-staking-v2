import { Text, Flex, Link } from "@chakra-ui/react";
import {SetStateAction} from 'react'
function OperatorInfoSub(props: { 
  title: string; 
  value: any; 
  setClicked: React.Dispatch<SetStateAction<any>>;
  tooltip?: any;
  type?: string;
}) {
  const { title, value, setClicked, tooltip, type } = props;
  return (
    <>
      {
        title === "Operator Address" || 
        title === "Operator Contract" ||
        type === "address" ? (
        <Flex flexDir={"column"} mb="25px">
          <Text fontSize={"13px"} color={"gray.700"}>
            {title}
          </Text>
          <Link
            isExternal
            mt="5px"
            fontSize={"12px"}
            color={"gray.700"}
            textDecor='underline'
            href={`https://etherscan.io/address/${value}`}
            fontWeight={500}
          >
            {value}
          </Link>
        </Flex>
      ) : value === 'main'  ? (
        <Flex 
          fontSize={'15px'}
          fontWeight={500}
          color={'#131315'}
          mb={'25px'}
        >
          {title}
        </Flex>
      ) : value === 'title' || value === 'address' ? (
        <Flex 
          fontSize={value === 'title' ? '15px' : '13px'}
          fontWeight={500}
          color={value === 'title' ? '#2a72e5' : '#131315'}
          mb={'25px'}
        >
          {title}
        </Flex>
      ) : (
        <Flex flexDir={"column"} mb="25px">
          {title === "Website" ?  <Text fontSize={"13px"} color={"gray.700"} >
            {title}
          </Text>: <Text fontSize={"13px"} color={"gray.700"}>
            {title}
          </Text>}
         
          <Text
            mt="5px"
            fontSize={"12px"}
            color={title === "Website" ? "blue.200" : "gray.700"}
            fontWeight={500}
            onClick={()=> setClicked(true)}
          >
            {value}
          </Text>
        </Flex>
      )}
    </>
  );
}

export default OperatorInfoSub;
