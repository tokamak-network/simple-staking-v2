import { atom } from "recoil";
import { v1 } from 'uuid';

export const userTransactions = atom<any>({
  key: `userTransactions/${v1()}`,
  default:undefined
})