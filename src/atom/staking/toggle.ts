import { atom, selector } from 'recoil';
import { v1 } from 'uuid';

const toggleState = atom({
  key: `checkValues/${v1()}`,
  default: 'All',
});

const selectedToggleState = selector({
  key: `selectedValues/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const selectedToggleState = get(toggleState);
    return selectedToggleState;
  },
});

export { toggleState, selectedToggleState };
