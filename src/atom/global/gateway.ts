import { atom, selector } from 'recoil';
import { v1 } from 'uuid';

const gatewayState = atom({
  key: `gatewayAddresses/${v1()}`,
  default: '',
});

const gatewayAddressState = selector({
  key: `inputGatewayValue/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const currentGatewayState = get(gatewayState);

    return currentGatewayState;
  },
});

export { gatewayState, gatewayAddressState };
