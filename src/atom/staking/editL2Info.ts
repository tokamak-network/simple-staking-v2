import { atom, selector } from "recoil";
import { v1 } from 'uuid';

const editL2Info_bridge_input = atom({
  key: `editL2Info_bridge_input/${v1()}`,
  default: '',
});

const editL2Info_bridge_state = selector({
  key: `editL2Info_bridge_state/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const editL2Info_bridge_state = get(editL2Info_bridge_input);
    return editL2Info_bridge_state;
  },
});

const editL2Info_explorer_input = atom({
  key: `editL2Info_explorer_input/${v1()}`,
  default: '',
});

const editL2Info_explorer_state = selector({
  key: `editL2Info_explorer_state/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const editL2Info_explorer_state = get(editL2Info_explorer_input);
    return editL2Info_explorer_state;
  },
});

const editL2Info_logo_input = atom({
  key: `editL2Info_logo_input/${v1()}`,
  default: '',
});

const editL2Info_logo_state = selector({
  key: `editL2Info_logo_state/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const editL2Info_logo_state = get(editL2Info_logo_input);
    return editL2Info_logo_state;
  },
});

export {
  editL2Info_bridge_input,
  editL2Info_bridge_state,
  editL2Info_explorer_input,
  editL2Info_explorer_state,
  editL2Info_logo_input,
  editL2Info_logo_state
};
