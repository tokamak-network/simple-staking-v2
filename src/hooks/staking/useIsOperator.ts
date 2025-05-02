import useContract from "hooks/useContract";
import CandidateAddOn from "services/abi/CandidateAddOn.json"
import OperatorManager from "services/abi/OperatorManager.json"
import SystemConfig from "services/abi/SystemConfig.json"
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
  const [bridge, setBridge]= useState<string>('')
  const [managers, setManagers] = useState<string>('')
  const [rollupConfig, setRollupConfig] = useState<string>('')
  const [claimable, setClaimable] = useState<string>('')
  const [rollupConfigInfo, setRollupConfigInfo] = useState<string>('')
  const [txPending, setTxPending] = useRecoilState(txState);
  const {
    WTON_CONTRACT, 
    SeigManager_CONTRACT,
    Layer2Manager_CONTRACT
  } = useCallContract()
  
  useEffect(() => {
    async function fetch() {
      if (CandidateAddOn_CONTRACT && account && layer2) {
        try {
          const operatorAddress = await CandidateAddOn_CONTRACT.operator();
          const OperatorManager_CONTRACT = await getContract(operatorAddress, OperatorManager, library, account);

          if (OperatorManager_CONTRACT && WTON_CONTRACT && SeigManager_CONTRACT && Layer2Manager_CONTRACT) {
            const manager = await OperatorManager_CONTRACT.manager();
            const rollupConfig = await OperatorManager_CONTRACT.rollupConfig();

            const rollupConfigInfo = await Layer2Manager_CONTRACT.rollupConfigInfo(rollupConfig);
            setRollupConfigInfo(rollupConfigInfo.status);
            if (rollupConfigInfo.status !== 1) {
              return;
            }
            const RollupConfig = await getContract(rollupConfig, SystemConfig, library, account)
            const checkIsOperator = manager.toLowerCase() === account.toLowerCase();
            const bridgeType = await OperatorManager_CONTRACT.checkL1Bridge();
            const bridge = await RollupConfig.optimismPortal();
            // console.log(bridge)
            const blockNumber = await library.getBlockNumber();
            const wtonBalanceOfOM = await WTON_CONTRACT.balanceOf(operatorAddress);
            const estimatedDistribution = await SeigManager_CONTRACT.estimatedDistribute(blockNumber + 1, layer2, true);
            const addedWton = wtonBalanceOfOM.add(estimatedDistribution.layer2Seigs);
            
            setBridge(bridge)
            setRollupConfig(rollupConfig);
            setClaimable(addedWton.toString());
            setOperatorManger(operatorAddress);
            setIsOperator(checkIsOperator);
            setBridgeTypes(bridgeType._type);
            setManagers(manager);
          }
        } catch (e) {
          // console.log(e);
        }
      }
    }
    fetch();
  }, [CandidateAddOn_CONTRACT, account, library, layer2, txPending, WTON_CONTRACT, SeigManager_CONTRACT, Layer2Manager_CONTRACT]);
  
  return { isOperator, bridgeTypes, operatorManager, managers, claimable, rollupConfig, bridge, rollupConfigInfo }
}