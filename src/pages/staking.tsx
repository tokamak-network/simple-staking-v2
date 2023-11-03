
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import DesktopStaking from "./components/staking/DesktopStaking";
import MobileStaking from "./components/staking/MobileStaking";

function Staking() {
  const [width] = useWindowDimensions();
  const mobile = width && width < 1040;

  return <>{mobile ? <MobileStaking /> : <DesktopStaking />}</>;
}

export default Staking;
