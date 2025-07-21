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
			<Flex alignItems={"center"} h="17px" mt="15px">
				<Flex flexDir={"row"} color={"#999999"}>
					Copyright © 2024
					<Text color={"#1c1c1c"} ml={"4px"}>
						Tokamak Network
					</Text>
				</Flex>
			</Flex>
		</Flex>
	);
}

export default MobileFooter;
