import { Box, Flex, Text, Button, Link } from "@chakra-ui/react";
import Image from "next/image";
import CLOSE_ICON from "assets/images/popup-close-icon.svg";

function DesktopHome() {
	return (
		<Flex
			w="100%"
			h="100vh"
			flexDir="column"
			justifyContent="center"
			alignItems="center"
			bg="#f4f6f8"
		>
			<Box
				bg="white"
				w="500px"
				borderRadius="20px"
				boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
				p="40px"
				textAlign="center"
				mb={'500px'}
			>
				<Box mb="30px">
					<Text
						color="#3d495d"
						fontSize="28px"
						fontWeight="bold"
						mb="15px"
					>
						Tokamak Staking Service
					</Text>
					<Text
						color="#86929d"
						fontSize="16px"
						lineHeight="1.6"
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
						h="50px"
						borderRadius="12px"
						fontSize="16px"
						fontWeight="600"
						mb="20px"
					>
						Go to Community Version
					</Button>
				</Link>

				<Text
					color="#86929d"
					fontSize="12px"
				>
					Thank you for using Tokamak Staking. We look forward to seeing you on the Community Version!
				</Text>
			</Box>
		</Flex>
	);
}

export default DesktopHome;
