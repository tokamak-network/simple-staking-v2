export type TokenTypes = "ETH" | "TON" | "WTON" | "TOS";

export type Pages = "Dashboard" | "Bond" | "Stake" | 'DAO';
export type PageKey = "Stake_screen" | "Bond_screen";

export type CheckBoxValueType = {
  page: Pages;
  values: any;
  key: string;
  pageKey: PageKey;
};

export type InputKey = Pages;

export type CheckBoxValuesType = CheckBoxValueType[] | undefined;
