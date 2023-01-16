import { atom, selector } from 'recoil';
import { v1 } from 'uuid';

const durationState = atom({
  key: `checkValues/${v1()}`,
  default: 'Year',
});

const selectedDurationState = selector({
  key: `selectedValues/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const selectedDurationState = get(durationState);
    return selectedDurationState;
  },
});

export { durationState, selectedDurationState };
