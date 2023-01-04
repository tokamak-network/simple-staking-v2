import { atom, selector } from "recoil";
import { v1 } from 'uuid';


const userStakedState = atom({
  key: `userStakedState/${v1()}`,
  default: '0.00',
});

const userStakedStatusState = selector({
  key: `userStakedStatusState/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const userStakedStatusState = get(userStakedState);
    return userStakedStatusState;
  },
});

export { userStakedState, userStakedStatusState };
