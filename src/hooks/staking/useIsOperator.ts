import useContract from "hooks/useContract";
import CandidateAddOn from "services/abi/CandidateAddOn.json"
import OperatorManager from "services/abi/OperatorManager.json"
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useCallContract from "../useCallContract";
import { getContract } from "utils/getContract";
import { l2InfoType } from "@/types";

export function useIsOperator (layer2: string) {
  const { account, library } = useWeb3React()
  const CandidateAddOn_CONTRACT = useContract(layer2, CandidateAddOn);
  const [isOperator, setIsOperator] = useState<boolean>(false)
  const [l2Infos, setL2Infos] = useState<l2InfoType>({})
  
  useEffect(() => {
    async function fetch() {
      
      if (CandidateAddOn_CONTRACT && account) {
        try {
          const operatorAddress = await CandidateAddOn_CONTRACT.operator()
          const OperatorManager_CONTRACT = await getContract(operatorAddress, OperatorManager, library, account)
          if (OperatorManager_CONTRACT) {
            const manager = await OperatorManager_CONTRACT.manager()
            const checkIsOperator = manager.toLowerCase() === account.toLowerCase()
            const l2Info = await OperatorManager_CONTRACT.l2Info()
            // console.log(JSON.parse(l2Info))
            setIsOperator(checkIsOperator !== undefined ? checkIsOperator : false);
            setL2Infos(JSON.parse(l2Info))
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
    fetch()
    
  }, [CandidateAddOn_CONTRACT, account])
  return { isOperator, l2Infos }
}