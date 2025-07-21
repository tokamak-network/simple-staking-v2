import {
	Button,
	calc,
	Flex,
	ListItem,
	Text,
	UnorderedList,
	useTheme,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

function RollingNumbers(props: { totalStaked: Number }) {
	const { totalStaked } = props;
	const [ready, setReady] = useState(false);
	const [split, setSplit] = useState<string[]>(["0"]);
	const twentyone = Array.from(Array(22).keys());

	useEffect(() => {
		if (totalStaked) {
			const splitNumber = totalStaked
				.toLocaleString(undefined, {
					maximumFractionDigits: 0,
					minimumFractionDigits: 0,
				})
				.split("");

			setSplit(splitNumber);
		}
	}, [totalStaked]);

	// const split = totalStaked
	//     .toLocaleString(undefined, {
	//       maximumFractionDigits: 0,
	//       minimumFractionDigits: 0,
	//     }).split("");

	setTimeout(() => {
		setReady(true);
	}, 100);

	return (
		<Flex
			display={"flex"}
			flexDir="row"
			justifyContent={"center"}
			h={"76px"}
			width="500px"
		>
			{ready ? (
				<Flex height={"50px"} overflow="hidden">
					<style>
						{`
            .digits {
                float: left;
                list-style-type: none;
                font-size: 50px;
                line-height: 1em;
                font-weight: 600;
                font-family: "Titillium Web", sans-serif;
                font-stretch: normal;
                font-style: normal;
                letter-spacing: 1.25px;
                text-align: center;
                color: #2a72e5;
                visibility: hidden;
            }
            .digits-first {
                margin-top: 0em; /* number 4! */
              }
             .digits {
                animation-duration: 1.5s;
                animation-timing-function: ease;
                /* animation-delay: 1.5s; */
                animation-fill-mode: forwards;
            }
            .rolling {
                animation-name: rolling;
            }
              /* Animations */
            @keyframes rolling {
                100% {
                  visibility: visible;
                  margin-top: -1000px;
                }
              }
              .unit {
                margin-left: 20px;
                 float:left;
                list-style-type: none;
                font-size: 50px;
                line-height: 1em;
                font-weight: 600;
                font-family: "Titillium Web", sans-serif;
                font-stretch: normal;
                font-style: normal;
                letter-spacing: 1.25px;
                text-align: center;
                color: #2a72e5;
            }
            `}
					</style>
					{split.map((item: string, index: number) => (
						<UnorderedList
							className="digits digits-first rolling"
							key={index}
							pl="0px"
							my="0px"
							ml="0px"
							style={{ animationDelay: `${(split.length - index) * 0.2}s` }}
						>
							{twentyone.map((index: number) => (
								<ListItem key={index} ml="0px">
									{index !== 20 ? Math.floor(Math.random() * 10) : item}
								</ListItem>
							))}
						</UnorderedList>
					))}
				</Flex>
			) : (
				<Flex>
					<UnorderedList
						className="digits digits-first rolling"
						pl="0px"
						my="0px"
						ml="0px"
					>
						<ListItem ml="0px">0</ListItem>
					</UnorderedList>
				</Flex>
			)}
			<Text className="unit">TON</Text>
		</Flex>
	);
}
export default RollingNumbers;
