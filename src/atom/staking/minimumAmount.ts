import { atom, selector } from "recoil";
import { v1 } from "uuid";

const minimumAmountState = atom({
	key: `minimumAmount/${v1()}`,
	default: true,
});

const minimumAmountStatus = selector({
	key: `minimumAmountStatusValue/${v1()}`, // unique ID (with respect to other atoms/selectors)
	get: ({ get }) => {
		const minimumAmountStatus = get(minimumAmountState);

		return minimumAmountStatus;
	},
});

export { minimumAmountState, minimumAmountStatus };
