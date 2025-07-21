import { Flex } from "@chakra-ui/react";
import Image from "next/image";

function SupportImage(props: { src: any; height?: string; width?: string }) {
	const { src, height, width } = props;
	return (
		<Flex
			borderRadius={"10px"}
			boxShadow={"0 1px 4px 0 rgba(96, 97, 112, 0.16)"}
			height={height ? "450px" : "100%"}
			justifyContent={"center"}
			alignItems="center"
			width={"100%"}
		>
			<Image src={src} alt={"src"} style={{ width: width, height: height }} />
		</Flex>
	);
}

export default SupportImage;
