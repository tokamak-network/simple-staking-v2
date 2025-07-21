import { atom, selector } from "recoil";
import { v1 } from "uuid";

export type Duration = "1-year" | "6-month" | "3-month" | "1-month";

const durationState = atom<Duration>({
	key: `checkValues/${v1()}`,
	default: "1-year",
});

const selectedDurationState = selector({
	key: `selectedValues/${v1()}`, // unique ID (with respect to other atoms/selectors)
	get: ({ get }) => {
		const selectedDurationState = get(durationState);
		return selectedDurationState;
	},
});

export { durationState, selectedDurationState };
