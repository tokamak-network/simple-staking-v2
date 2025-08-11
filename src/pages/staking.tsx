import { useEffect } from "react";
import { useRouter } from "next/router";

function Staking() {
	const router = useRouter();

	useEffect(() => {
		// 커뮤니티 버전으로 리다이렉트
		window.location.href = "https://community.staking.tokamak.network";
	}, []);

	return (
		<div style={{ 
			display: 'flex', 
			justifyContent: 'center', 
			alignItems: 'center', 
			height: '100vh',
			fontFamily: 'Arial, sans-serif',
			textAlign: 'center'
		}}>
			<div>
				<h2>Redirecting to Community Version...</h2>
				<p>If you are not redirected automatically, please click the link below:</p>
				<a 
					href="https://community.staking.tokamak.network"
					style={{ 
						color: '#2a72e5', 
						textDecoration: 'none',
						fontWeight: 'bold'
					}}
				>
					Go to Community Version
				</a>
			</div>
		</div>
	);
}

export default Staking;
