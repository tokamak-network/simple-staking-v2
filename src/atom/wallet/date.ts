import { atom, selector } from 'recoil';
// import { CheckBoxValuesType } from '@/types';
import { v1 } from 'uuid';

const startDateState = atom ({
  key: `startDateStateValues/${v1()}`,
  default: undefined,
});

const startDateStatusState = selector({
  key: `startDateStatusState/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const startDateStatus = get(startDateState);
    return startDateStatus;
  },
});

const endDateState = atom ({
  key: `endDateStateValues/${v1()}`,
  default: undefined,
});

const endDateStatusState = selector({
  key: `endDateStatusState/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const endDateStatus = get(endDateState);
    return endDateStatus;
  },
});

export { startDateState, startDateStatusState, endDateState, endDateStatusState };
