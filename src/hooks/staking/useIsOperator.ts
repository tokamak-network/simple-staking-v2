import useContract from "hooks/useContract";
import Layer2Candidate from "services/abi/Layer2Candidate.json"
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";

export function useIsOperator (layer2: string) {
  const { account } = useWeb3React()
  
  const L2Candidate_CONTRACT = useContract(layer2, Layer2Candidate);
  useEffect(() => {
    async function fetch() {
      console.log(L2Candidate_CONTRACT)
      if (L2Candidate_CONTRACT) {
        try {

          const isOperator = await L2Candidate_CONTRACT.operator(account)
          console.log(isOperator)
        } catch (e) {
          console.log(e)
        }
      }
    }
    fetch()
  }, [L2Candidate_CONTRACT])
}