import type { NextPage } from "next";

import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
	const router = useRouter();

	useEffect(() => {
		router.push("/home");
	}, []);

	return <div></div>;
};

export default Home;
