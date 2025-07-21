import {
	editL2Info_logo_input,
	editL2Info_logo_state,
	editL2Info_bridge_input,
	editL2Info_bridge_state,
} from "@/atom/staking/editL2Info";
import {
	editL2Info_explorer_input,
	editL2Info_explorer_state,
} from "@/atom/staking/editL2Info";
import { useEffect } from "react";
import {
	Resetter,
	SetterOrUpdater,
	useRecoilState,
	useRecoilValue,
	useResetRecoilState,
} from "recoil";

function useeditL2InfoInput<T>(key: string): {
	inputValue: T | any;
	value: any | any;
	setValue: SetterOrUpdater<any> | any;
	setResetValue: Resetter | any;
} {
	const editL2Info_bridge_inputValues = useRecoilValue(editL2Info_bridge_state);
	const [bridgeValue, setBridgeValue] = useRecoilState(editL2Info_bridge_input);
	const reseteditL2InfoBridgeValue = useResetRecoilState(
		editL2Info_bridge_input,
	);

	const editL2Info_explorer_inputValues = useRecoilValue(
		editL2Info_explorer_state,
	);
	const [explorerValue, setExplorerValue] = useRecoilState(
		editL2Info_explorer_input,
	);
	const reseteditL2InfoExplorerValue = useResetRecoilState(
		editL2Info_explorer_input,
	);

	const editL2Info_logo_inputValues = useRecoilValue(editL2Info_logo_state);
	const [logoValue, setLogoValue] = useRecoilState(editL2Info_logo_input);
	const resetLogoValue = useResetRecoilState(editL2Info_logo_input);

	switch (key) {
		case "explorer":
			return {
				inputValue: editL2Info_explorer_inputValues,
				value: explorerValue,
				setValue: setExplorerValue,
				setResetValue: reseteditL2InfoExplorerValue,
			};
		case "bridge":
			return {
				inputValue: editL2Info_bridge_inputValues,
				value: bridgeValue,
				setValue: setBridgeValue,
				setResetValue: reseteditL2InfoBridgeValue,
			};
		case "logo":
			return {
				inputValue: editL2Info_logo_inputValues,
				value: logoValue,
				setValue: setLogoValue,
				setResetValue: resetLogoValue,
			};
		default:
			return {
				inputValue: undefined,
				value: undefined,
				setValue: undefined,
				setResetValue: undefined,
			};
	}
}

export default useeditL2InfoInput;
