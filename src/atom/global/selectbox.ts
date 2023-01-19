import { atom, selector } from 'recoil';
// import { SelectBoxValuesType } from '@/types';
import { v1 } from 'uuid';

const selectboxState = atom({
  key: `selectValues/${v1()}`,
  default: undefined,
});

const selectedState = selector({
  key: `selectedValues/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const selectedModalState = get(selectboxState);
    return selectedModalState;
  },
});

export { selectboxState, selectedState };
