import { Box, Flex, Text, Button, Link } from "@chakra-ui/react";
import Image from "next/image";
import CLOSE_ICON from "assets/images/popup-close-icon.svg";

function MobileHome() {
	return (
		<Flex
			w="100%"
			h="100vh"
			flexDir="column"
			justifyContent="center"
			alignItems="center"
			bg="#f4f6f8"
			px="20px"
		>
			<Box
				bg="white"
				w="100%"
				maxW="400px"
				borderRadius="16px"
				boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
				p="30px"
				textAlign="center"
			>
				<Box mb="25px">
					<Text
						color="#3d495d"
						fontSize="24px"
						fontWeight="bold"
						mb="12px"
					>
						Tokamak Staking Service
					</Text>
					<Text
						color="#86929d"
						fontSize="14px"
						lineHeight="1.5"
					>
						This service has been discontinued and moved to the Community Version.
					</Text>
				</Box>

				<Link href="https://community.staking.tokamak.network" isExternal>
					<Button
						bg="#2a72e5"
						color="white"
						_hover={{ bg: "#1e5bb8" }}
						w="100%"
						h="44px"
						borderRadius="10px"
						fontSize="15px"
						fontWeight="600"
						mb="16px"
					>
						Go to Community Version
					</Button>
				</Link>

				<Text
					color="#86929d"
					fontSize="11px"
				>
					Thank you for using Tokamak Staking. We look forward to seeing you on the Community Version!
				</Text>
			</Box>
		</Flex>
	);
}

export default MobileHome;
