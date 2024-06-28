// import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import useCallContract from "../useCallContract";


export function useL2CandidateInfo (data: any) {
  const { 
    Layer2Registry_CONTRACT
  } = useCallContract();

  useEffect(() => {
    async function fetch() {
      if (Layer2Registry_CONTRACT && data !== null) {
        // console.log('aa')
        // const type = await Layer2Registry_CONTRACT.systemConfigType(data.systemConfig)
        // console.log(type)
      }
    }
    fetch()
  }, [])
}