import { getOperatorsInfo } from "@/api";
import { useEffect, useState } from 'react';


export function useOperatorList() {
  const [operatorList, setOperatorList] = useState([]);
  useEffect(() => {

    async function fetchList () {
      const data = await getOperatorsInfo();
      setOperatorList(data)
    }
    fetchList()
  }, [])

  return { operatorList }
}

export default useOperatorList