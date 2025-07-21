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
import unstake_01 from "assets/images/support/unstake_01.png";
import unstake_02 from "assets/images/support/unstake_02.png";

function Unstake(props: { reef: any }) {
	const theme = useTheme();
	const { reef } = props;

	return (
		<Flex ref={reef} flexDir="column" fontFamily={theme.fonts.Roboto} mt="40px">
			<Heading
				size={"md"}
				color={"blue.200"}
				fontSize="20px"
				fontWeight={500}
				mb="40px"
			>
				Un-stake
			</Heading>
			<Flex mt="20px" justifyContent={"center"} alignItems="center" mb="30px">
				<Flex
					borderRadius={"10px"}
					m="30px"
					boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
				>
					<Image src={unstake_01} alt={"stake_2"} />
				</Flex>
				<Flex
					borderRadius={"10px"}
					m="30px"
					boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
				>
					<Image src={unstake_02} alt={"stake_3"} />
				</Flex>
			</Flex>
			<OrderedList>
				<ListItem color={"black.100"}>
					<Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
						Press the <span style={{ fontWeight: "bold" }}>Unstake</span> button
						and a popup will appear.
					</Text>
				</ListItem>
				<ListItem color={"black.100"}>
					<Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
						Insert the amount of TON to unstake.
					</Text>
				</ListItem>
				<ListItem color={"black.100"}>
					<Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
						Click the <span style={{ fontWeight: "bold" }}>Unstake</span>{" "}
						button.
					</Text>
				</ListItem>
				<ListItem color={"black.100"}>
					<Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
						Click the confirm button of the Metamask popup that will open from
						the Metamask extension of your browswer.
					</Text>
					<UnorderedList>
						<ListItem>
							<Text {...theme.SUPPORT_PARAGRAPH_STYLE.paragraphText()}>
								Not Withdrawable: If you unstake staked TON, it is the quantity
								of TON that is in the withdrawal delay period set by the
								operator. (Default is 93046 blocks, approximately 2 weeks){" "}
							</Text>
						</ListItem>
					</UnorderedList>
				</ListItem>
			</OrderedList>
		</Flex>
	);
}

export default Unstake;
