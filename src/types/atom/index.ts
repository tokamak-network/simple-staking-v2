export type Bond_InputKey = "bond_modal";
export type Bond_BondModal = {
	bond_modal_balance: string | number | undefined;
	bond_modal_period: number | undefined;
};
export type Bond_InputValueType = Bond_BondModal;

export type Stake_InputKey =
	| "withdraw_modal"
	| "unstake_modal"
	| "stake_modal"
	| "restake_modal";

export type InputKey = Stake_InputKey;
