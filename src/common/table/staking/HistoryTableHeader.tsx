import { 
  chakra, 
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Center,
  Text
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { getColumnWidthStaking } from '@/utils/getColumnWidth';
import LIST_ICON from '@/assets/images/list-arrow_icon.svg';
import Image from "next/image";
import { useRecoilState } from "recoil";
import { typeFilterState } from "@/atom/staking/txTypeFilter";

type HistoryTableHeaderProps = {
  tableType: string
}

export const HistoryTableHeader: FC<HistoryTableHeaderProps> = ({
  tableType
}) => {
  return  (
    <chakra.thead
      borderBottom={'1px dashed #e6eaee'}
      // mr={'30px'}
      w={'100%'}
      h={'40px'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <chakra.tr 
        fontSize={'13px'}
        color={'#808992'}
        h={'40px'}
      >
        { HeaderColumn(tableType, 'Account') }
        { HeaderColumn(tableType, 'TX Hash') }
        { HeaderColumn(tableType, 'Type') }
        { HeaderColumn(tableType, 'Amount') }
        { HeaderColumn(tableType, 'Time') }
      </chakra.tr>
    </chakra.thead>
  )
}

export default HistoryTableHeader

const HeaderColumn = (tableType: string, columnName: string) => {
  return (
    <chakra.th
      w={ getColumnWidthStaking(tableType, columnName) }
      textAlign={columnName === 'Account' || columnName === 'TX Hash'? 'left' : 'center'}
    >
      <Flex flexDir={'row'} justifyContent={'center'}>
        {
          tableType === 'Staking' && columnName === 'Account' ? 'Account' :
          columnName === 'TX Hash' ? 'TX Hash' :
          tableType === 'Staking' && columnName === 'Type' ? <TypeItem /> :
          tableType === 'Staking' && columnName === 'Amount' ? 'Amount' :
          columnName === 'Time' ? 'Time' : ''
        }
      </Flex>
    </chakra.th>
  )
}

const typeItemList = [
  'All', 'Stake', 'Unstake', 'Withdraw'
]

const TypeItem = () => {
  const [menuState, setMenuState] = useState(false);
  const [hover, setHover] = useState(false);
  const handleMenuButtonClick = (event: any) => {
    event.preventDefault();

    !menuState && setMenuState(!menuState);
  };

  const [typeFilter, setTypeFilter] = useRecoilState(typeFilterState);

  return (
    <Menu
      onClose={() => {
        setMenuState(false);
      }}
      isOpen={menuState}
    >
      <MenuButton 
        as={Center}
        fontSize={'13px'}
        cursor={"pointer"}
        h={'40px'}
        // onMouseEnter={handleMenuButtonhover}
        // // onMouseLeave={()=> setHoverOn(false)}
        // onMouseDown={handleMenuButtonClick}
        borderBottom={menuState ? "none" : ""}
        onClick={handleMenuButtonClick}
        display={"flex"}
        flexDir={"row"}
      >
        <Flex>
          <Text>Type</Text>
          <Flex
            marginLeft={"3px"}
            height={"20px"}
            justifyContent={'center'}
            alignItems={'center'}
            // width={"24px"}
            transform={menuState === true ? "rotate(180deg)" : ""}
          >
            <Image src={LIST_ICON} alt="icon_arrow" />
          </Flex>
        </Flex>
      </MenuButton>
      <MenuList
        onMouseLeave={() => setMenuState(false)}
        bg="#fff"
        mt={"-15px"}
        border={"1px"}
        borderColor={'#E7EBF2'}
        fontSize={'12px'}
        fontWeight={'normal'}
        color={'#7a7e87'}
        py={0}
        style={{
          minWidth: "77px",
          marginLeft: "-20px"
        }}
      >
        {
          typeItemList.map((item: string) => {   
            return [
              <MenuItem
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                h={'26px'}
                _hover={{ bg: '#2a72e5', color: '#fff' }}
                borderTop={item !== 'All' ? '1px' : ''}
                borderColor={'#e7ebf2'}
                justifyContent={'center'}
                onClick={() => setTypeFilter(item)}
              >
                {item}
              </MenuItem>
            ]
          })
        }
      </MenuList>
    </Menu>
  )
}