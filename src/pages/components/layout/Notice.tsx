import React from "react";
import { Box, Flex, Text, Link, Image } from "@chakra-ui/react";
import TOKAMAK_LOGO from "@/assets/images/tokamak_logo.svg"; // 실제 경로에 맞게 수정하세요.

const Notice = () => (
	<Box
		w="100%"
		bg="#fff"
		py="2"
		px="0"
		textAlign="center"
		borderBottom={"1px solid #2a72e5"}
	>
		<Flex align="center" justify="center" h={"16px"} my={"16px"}>
			<Text
				fontSize="13px"
				fontFamily={"Inter"}
				fontWeight={"normal"}
				color="#3d495d"
			>
				Tokamak Staking is transitioning to the Community Version!{" "}
				<Link
					href="https://community.staking.tokamak.network/"
					color="#2a72e5"
					isExternal
					fontWeight="bold"
				>
					[Click here to go to the Community Version]
				</Link>
			</Text>
		</Flex>
	</Box>
);

export default Notice;
