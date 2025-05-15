import ConfirmationTX from "@/common/modal/Confirmation/index";
import ClaimModal from "@/common/modal/L2Info/ClaimModal";
import RestakeModal from "@/common/modal/Restake/RestakeModal";
import WalletModal from "@/common/modal/Wallet";
import WithdrawModal from "@/common/modal/withdraw/WithdrawModal";
// import useMediaView from "@/hooks/mediaView/useMediaView";
import CalculatorModal from "./components/staking/CalculatorModal";
import StakeModal from "./components/staking/StakeModal";

export default function Modals() {
  // const { mobileView } = useMediaView();

  return (
    <>
      <ConfirmationTX />
      <StakeModal />
      <WithdrawModal />
      <WalletModal />
      <CalculatorModal />
      <WalletModal />
      <ClaimModal />
      <RestakeModal />
    </>
  );
}
