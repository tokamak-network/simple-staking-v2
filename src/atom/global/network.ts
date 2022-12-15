import { atom, selector } from 'recoil';
import { v1 } from 'uuid';

const targetNetworkState = atom({
  key: `networkIdValue/${v1()}`,
  default: 0,
});

const selectedTargetNetworkState = selector({
  key: `selectedNetwork/${v1()}`,
  get: ({ get }) => {
    const selectedNetworkState = get(targetNetworkState);

    return selectedNetworkState;
  },
});

export { targetNetworkState, selectedTargetNetworkState };
