import { atom, selector } from 'recoil';
import { v1 } from 'uuid';

const currentPriceState = atom({
  key: `priceValue/${v1()}`,
  default: {},
});

const priceState = selector({
  key: `currentPrice/${v1()}`,
  get: ({ get }) => {
    const priceStates = get(currentPriceState);

    return priceStates;
  },
});

export { currentPriceState, priceState };
