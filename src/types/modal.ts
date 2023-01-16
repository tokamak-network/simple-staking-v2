export type GlobalType = "network_swtich" | "termsOfUse";

export type BondModalType = "bond_bond_modal";

export type StakeModalType =
  | "staking"
  | "unstaking"
  | "restaking"
  | "withdraw"
  | "calculator"
  | 'wallet_modal';

export type ModalType = GlobalType | BondModalType | StakeModalType;
