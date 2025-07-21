import {
	Flex,
	Text,
	Heading,
	useTheme,
	UnorderedList,
	OrderedList,
	ListItem,
	Link,
} from "@chakra-ui/react";
import Image from "next/image";
import connect_01 from "assets/images/support/connect_01.png";
import connect_02 from "assets/images/support/connect_02.png";
import connect_03 from "assets/images/support/connect_03.png";
import wallet_connect_screenshot_1 from "assets/images/wallet_connect_screenshot_1.png";

function Login(props: { reef: any }) {
	const theme = useTheme();
	const { reef } = props;

	return (
		<Flex ref={reef} flexDir="column" fontFamily={theme.fonts.Roboto} mt="40px">
			<Heading
				size={"md"}
				color={"blue.200"}
				fontSize="20px"
				fontWeight={500}
				mb="20px"
			>
				Login
			</Heading>
			<Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
				You need to login to our staking service by connecting your wallet to
				the simple staking service to obtain access to some functionalities such
				as staking and account information. By clicking the{" "}
				<span style={{ fontWeight: "bold" }}>Connect Wallet</span> button on the
				top right of the screen you can choose how to connect to your wallet.
			</Text>
			<Text fontSize="17px" color={"blue.200"} fontWeight={700} mb="10px">
				Connect with Metamask
			</Text>
			<OrderedList>
				<ListItem color={"black.100"}>
					<Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
						Make sure you are connected to the Ethereum Mainnet network. Then
						click <span style={{ fontWeight: "bold" }}>Connect Wallet</span>{" "}
						button
					</Text>
				</ListItem>
				<ListItem>
					<Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
						Click the <span style={{ fontWeight: "bold" }}>Metamask</span> icon
						on the pop-up.
					</Text>
				</ListItem>
				<ListItem>
					Click on the Metmask icon of your browser extensions list and select
					the account you want to connect to our service.
				</ListItem>
			</OrderedList>
			<Flex mt="30px" justifyContent={"center"} alignItems="center">
				<Flex
					borderRadius={"10px"}
					m="30px"
					boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
				>
					<Image src={connect_01} alt={"connect_01"} />
				</Flex>
				<Flex
					borderRadius={"10px"}
					m="30px"
					boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
				>
					<Image src={connect_02} alt={"connect_02"} />
				</Flex>
			</Flex>
			<Text fontSize="17px" color={"blue.200"} fontWeight={700} mb="10px">
				Connect with WalletConnect
			</Text>
			<OrderedList>
				<ListItem color={"black.100"}>
					<Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
						Click the <span style={{ fontWeight: "bold" }}>Connect Wallet</span>{" "}
						button.
					</Text>
				</ListItem>
				<ListItem color={"black.100"}>
					<Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
						Click the <span style={{ fontWeight: "bold" }}>WalletConnect</span>{" "}
						icon on the pop-up.
					</Text>
				</ListItem>
				<ListItem color={"black.100"}>
					<Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
						Scan the QR code that appears on the screen with a mobile
						application that allows you to connect to DAPPs by scanning a QR
						code such as the Metamask mobile app or Trust Wallet app.
					</Text>
				</ListItem>
			</OrderedList>
			<Flex mt="30px" justifyContent={"center"} alignItems="center">
				<Flex
					borderRadius={"10px"}
					m="30px"
					height={"30%"}
					width={"25%"}
					boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
				>
					<Image src={connect_03} alt={"connect_03"} />
				</Flex>
				<Flex
					height={"30%"}
					width={"25%"}
					borderRadius={"10px"}
					m="30px"
					boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
				>
					<Image
						src={wallet_connect_screenshot_1}
						alt={"wallet_connect_screenshot_1"}
					/>
				</Flex>
			</Flex>
		</Flex>
	);
}

export default Login;
