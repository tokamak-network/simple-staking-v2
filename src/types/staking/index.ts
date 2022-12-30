import { TokenTypes } from "types";

export type StakeCardProps =
  | {
      staked: string;
      principal: string;
      endTime: string;
      isOver: boolean;
      stakedType: "Staking" | "LTOS Staking" | "Bond";
      tokenType: TokenTypes;
      stakedId: string;
      isWithoutLockup?: boolean;
    }
  | undefined;

export type StakeModalBottomContents = {
  ltos: string | undefined;
  currentBalance: string | undefined;
  newBalance: string | undefined;
  currentTosValue: string | undefined;
  newBalanceTosValue: string | undefined;
};
