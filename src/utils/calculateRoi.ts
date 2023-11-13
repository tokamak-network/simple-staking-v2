import { getTotalStaked } from '@/api';
import { Duration } from '@/atom/staking/duration';

function convertDurationToSec(duration: Duration) {
  switch (duration) {
    case '1-year':
      return 31536000;
    case '6-month':
      return 31536000 / 2;
    case '3-month':
      return 31536000 / 4;
    case '1-month':
      return 31536000 / 12;
    default:
      break;
  }
}

/**
 * calculate Roi based on params
 * @param totalStakedAmount is total amount being staked for now
 * @param totalSupply is total supply amount of TON
 **/
export function calculateRoi(totalStakedAmount: number, totalSupply: number) {
  const seigPerBlock = 3.92;
  const blockNumsPerYear = 2628000;
  const stakedRatio = totalStakedAmount / totalSupply;

  const roi = (seigPerBlock * blockNumsPerYear * (stakedRatio + 0.4 * (1 - stakedRatio))) / totalStakedAmount;

  return roi;
}

export function calculateRoiBasedonCompound(params: {
  totalStakedAmount: number;
  totalSupply: number;
  duration: Duration;
}) {
  const { totalStakedAmount, totalSupply, duration } = params;
  //# of compounds per 30 days in a year
  //31536000/60/60/24/30
  const compoundsPerMonth = 12.16666667;
  const annualAPY = calculateRoi(totalStakedAmount, totalSupply);
  const adjustedAPY = annualAPY / compoundsPerMonth;
  const stakeDuration = convertDurationToSec(duration);

  if (typeof stakeDuration !== 'number') return 0;

  const apyPerMonth = (1 + adjustedAPY) ** ((compoundsPerMonth * stakeDuration) / 31536000) - 1;

  return apyPerMonth * 100;
}
