import { atom, selector } from "recoil";
import { v1 } from "uuid";

const openInfonState = atom<string>({
	key: `checkValues/${v1()}`,
	default: "",
});

const selectedOpenInfonState = selector({
	key: `selectedValues/${v1()}`, // unique ID (with respect to other atoms/selectors)
	get: ({ get }) => {
		const selectedOpenInfonState = get(openInfonState);
		return selectedOpenInfonState;
	},
});

export { openInfonState, selectedOpenInfonState };
