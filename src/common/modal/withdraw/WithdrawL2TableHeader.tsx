import { chakra, Checkbox, Flex } from "@chakra-ui/react";
import { FC } from "react";
import { getColumnWidthWithdraw } from '@/utils/getColumnWidth';
import REFRESH from '@/assets/images/refresh_icon.svg'
import Image from "next/image";
import { useRecoilState } from "recoil";
import { refreshState } from "@/atom/staking/refresh";

type WithdrawL2TableHeaderProps = {
 
}

export const WithdrawL2TableHeader: FC<WithdrawL2TableHeaderProps> = ({
 
}) => {
  const [, setRefresh] = useRecoilState(refreshState)
  return  (
    <chakra.thead
      borderBottom={'1px solid #f4f6f8'}
      // mr={'30px'}
      w={'100%'}
      h={'33px'}
      alignItems={'center'}
      justifyContent={'center'}
      mb={'10px'}
    >
      <chakra.tr 
        fontSize={'11px'}
        fontWeight={500}
        color={'#3e495c'}
        h={'33px'}
      >
        <chakra.th
          w={'160px'}
        >
          Amount 
        </chakra.th>
        <chakra.th
          w={'160px'}
        >
          <Flex flexDir={'row'} justifyContent={'center'} ml={'10px'}>
            Withdrawn
            <Flex
              cursor={'pointer'}
              ml={'3px'}
              onClick={() => {
                setRefresh(true)
              }}
            >
              <Image src={REFRESH} alt={''} />
            </Flex>
          </Flex>
        </chakra.th>
      </chakra.tr>
    </chakra.thead>
  )
}

export default WithdrawL2TableHeader
