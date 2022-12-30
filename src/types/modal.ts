export type GlobalType = "network_swtich" | "termsOfUse";

export type BondModalType = "bond_bond_modal";

export type StakeModalType =
  | "stake_stake_modal"
  | "stake_unstake_modal"
  | "stake_update_modal"
  | "stake_multiUnstake_modal"
  | "stake_updateAfterEndTime_modal";

export type ModalType = GlobalType | BondModalType | StakeModalType;
