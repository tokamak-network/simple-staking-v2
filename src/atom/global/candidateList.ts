import { atom, selector } from 'recoil';
import { v1 } from 'uuid';

const candidateState = atom<any>({
  key: `candidateState/${v1()}`,
  default: '',
});

const candidateValues = selector({
  key: `candidateValues/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const selectedCandidateValuesState = get(candidateState);
    return selectedCandidateValuesState;
  },
});

export { candidateState, candidateValues };
