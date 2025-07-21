import { atom, selector } from "recoil";
import { v1 } from "uuid";

const refreshState = atom({
	key: `refresh/${v1()}`,
	default: true,
});

const selectedRefreshState = selector({
	key: `refreshValues/${v1()}`, // unique ID (with respect to other atoms/selectors)
	get: ({ get }) => {
		const selectedDurationState = get(refreshState);
		return selectedDurationState;
	},
});

export { refreshState, selectedRefreshState };
