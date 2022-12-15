import { atom, selector } from 'recoil';
import { CheckBoxValuesType } from '@/types';
import { v1 } from 'uuid';

const checkboxState = atom<CheckBoxValuesType>({
  key: `checkValues/${v1()}`,
  default: undefined,
});

const selectedCheckboxState = selector({
  key: `selectedValues/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const selectedModalState = get(checkboxState);
    return selectedModalState;
  },
});

export { checkboxState, selectedCheckboxState };
