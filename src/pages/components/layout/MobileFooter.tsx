import { Flex, Text, Image } from "@chakra-ui/react";

function MobileFooter() {
  return (
    <Flex
      borderTop={"1px solid #e8edf2"}
      h="134px"
      w="100%"
      justifyContent={"center"}
      alignItems="center"
      flexDir={"column"}
    >
      {/* <Text fontSize={"12px"} color="#7e7e8f">
        Terms of Use
      </Text> */}
      <Flex alignItems={"center"} h="17px" mt="15px" >
        <Text fontSize={"12px"} color="#7e7e8f">
          TOKAMAK NETWORK PTE.LTD
        </Text>
        <Flex fontSize={"12px"} color="#7e7e8f" alignItems={'center'} ml='15px'>
          <Flex
          mr='12px'
            style={{
              height: "4px",
              width: "4px",
              background: "#9a9aaf",
              borderRadius: "50%",
            }}
          ></Flex>
          <Text>
            {" "}
            <span style={{ color: "#2775ff" }}>hello</span>@tokamak.network
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default MobileFooter;
