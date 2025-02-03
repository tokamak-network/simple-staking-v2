import useContract from "hooks/useContract";
import CandidateAddOn from "services/abi/CandidateAddOn.json"
import OperatorManager from "services/abi/OperatorManager.json"
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useCallContract from "../useCallContract";
import { getContract } from "utils/getContract";
import { l2InfoType } from "@/types";
import { txState } from "@/atom/global/transaction";
import { useRecoilState } from "recoil";

export function useIsOperator (layer2: string | undefined) {
  const { account, library } = useWeb3React()
  const CandidateAddOn_CONTRACT = useContract(layer2, CandidateAddOn);
  const [isOperator, setIsOperator] = useState<boolean>(false)
  const [operatorManager, setOperatorManger] = useState<string>('');
  const [bridgeTypes, setBridgeTypes]= useState<number>(0);
  const [managers, setManagers] = useState<string>('')
  const [claimable, setClaimable] = useState<string>('')
  const [stakable, setStakable] = useState<string>('')
  const {WTON_CONTRACT, SeigManager_CONTRACT} = useCallContract()
  const [txPending, setTxPending] = useRecoilState(txState);
  
  useEffect(() => {
    async function fetch() {
      
      if (CandidateAddOn_CONTRACT && account && layer2) {
        try {
          const operatorAddress = await CandidateAddOn_CONTRACT.operator()
          
          const OperatorManager_CONTRACT = await getContract(operatorAddress, OperatorManager, library, account)
          if (OperatorManager_CONTRACT && WTON_CONTRACT && SeigManager_CONTRACT) {
            const manager = await OperatorManager_CONTRACT.manager()
          
            const checkIsOperator = manager.toLowerCase() === account.toLowerCase()
            
            const bridgeType = await OperatorManager_CONTRACT.checkL1Bridge()
            
            const blockNumber = await library.getBlockNumber();
            const wtonBalanceOfOM = await WTON_CONTRACT.balanceOf(operatorAddress)
            const estimatedDistribution = await SeigManager_CONTRACT.estimatedDistribute(blockNumber + 1, layer2, true)
            // const stakeOfOperator = await SeigManager_CONTRACT.stakeOf(layer2, manager)

            // const wtonBalance = wtonBalanceOfOM.toString()
            // const estiDistribution = estimatedDistribution.layer2Seigs.toString();
            
            const addedWton = wtonBalanceOfOM.add(estimatedDistribution.layer2Seigs)
            
            setClaimable(addedWton.toString())
            // setStakable
            
            const infoType = {
              bridge: "",
              explorer: "",
              logo: ""
            }
            
            setOperatorManger(operatorAddress)
            setIsOperator(checkIsOperator !== undefined ? checkIsOperator : false);
            // setL2Infos(l2Info === '' ? infoType : JSON.parse(l2Info))
            setBridgeTypes(bridgeType._type)
            setManagers(manager)
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
    fetch()
    
  }, [CandidateAddOn_CONTRACT, account, txPending])
  return { isOperator, bridgeTypes, operatorManager, managers, claimable }
}