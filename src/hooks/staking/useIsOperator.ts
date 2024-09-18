import useContract from "hooks/useContract";
import CandidateAddOn from "services/abi/CandidateAddOn.json"
import OperatorManager from "services/abi/OperatorManager.json"
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import useCallContract from "../useCallContract";

export function useIsOperator (layer2: string) {
  const { account } = useWeb3React()
  
  const L2Candidate_CONTRACT = useContract(layer2, CandidateAddOn);
  const { SeigManager_CONTRACT } = useCallContract();
  
  useEffect(() => {
    async function fetch() {
      console.log(L2Candidate_CONTRACT)
      if (L2Candidate_CONTRACT && SeigManager_CONTRACT) {
        try {

          const isOperator = await L2Candidate_CONTRACT.operator()
          const a = await SeigManager_CONTRACT.isOperator(account)
          console.log(layer2, a)
        } catch (e) {
          console.log(e)
        }
      }
    }
    fetch()
  }, [L2Candidate_CONTRACT])
}