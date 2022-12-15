import { atom, selector } from 'recoil';
import { v1 } from 'uuid';

const modalState = atom({
  key: `modalType/${v1()}`,
  default: '',
});

const selectedModalState = selector({
  key: `selectedModal/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const selectedModalState = get(modalState);

    return selectedModalState;
  },
});

export { modalState, selectedModalState };
