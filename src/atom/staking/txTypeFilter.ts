import { atom, selector } from 'recoil';
import { v1 } from 'uuid';

const typeFilterState = atom({
  key: `txTypeFilter/${v1()}`,
  default: 'All',
});

const selectedTypeState = selector({
  key: `selectedValues/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const selectedTypeState = get(typeFilterState);
    return selectedTypeState;
  },
});

export { typeFilterState, selectedTypeState };
