import { atom, selector } from 'recoil';
import { v1 } from 'uuid';

const tokenState = atom({
  key: `tokenState/${v1()}`,
  default: 'ETH',
});

const selectedTokenState = selector({
  key: `selectedTokenState/${v1()}`,
  get: ({ get }) => {
    const selectedToken = get(tokenState);

    return selectedToken;
  },
});

export { tokenState, selectedTokenState };
