export type TokenTypes = 'ETH' | 'TON' | 'WTON';
export type TxSort = 'Stake' | 'Unstake' | 'Withdraw' | 'Restake' | 'Update Seigniorage' | 'Claim' | "Withdraw L2"
export type Pages = 'Home' | 'Wallet' | 'Staking' | 'Support';
export type PageKey = 'Staking_screen' | 'Wallet_screen';

export type CheckBoxValueType = {
  page: Pages;
  values: any;
  key: string;
  pageKey: PageKey;
};

export type l2InfoType = {
  bridge: string,
  explorer: string,
  url: string  
} | any

export type StakeModalDataType = {
  tonBalance: string,
  wtonBalance: string,
  pendingUnstaked: string,
  stakedAmount: string ,
  withdrawable: string,
  old_withdrawable: string,
  layer2: string,
  old_layer2: string | undefined,
  withdrawableLength: string,
  old_withdrawableLength: string,
  seig: string,
  candidate: string,
  minimumAmount: boolean,
  requests: any[],
  isL2: boolean,
  name: string,
  apy: string,
}

export type ClaimModalDataType = {
  name: string,
  target: string,
  address: string,
  amount: string,
  contractAddress: string,
  claimable: string,
  expectedSeig: string,
  expectedSeigs: string,
  layerName: string,
}

export type StakeModalComponentType = {
  header: string,
  subHeader: string,
  balance: string,
  balanceInfo: string,
  balanceInfo1: string,
  balance1: string,
  balanceInfo2: string,
  balance2: string,
  balance3: string,
  bottomComment: string,
  buttonName: string
}

export type InputKey = Pages;

export type CheckBoxValuesType = CheckBoxValueType[] | undefined;
