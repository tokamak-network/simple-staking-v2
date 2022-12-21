import { IconClose } from "@/common/Icons/IconClose";
import { IconOpen } from "@/common/Icons/IconOpen";
import useOperatorList from "@/hooks/staking/useOperatorList";
import { Box, Flex, Text, useMediaQuery, useTheme } from "@chakra-ui/react";
import { useMemo, useCallback, useState } from 'react';
import PageHeader from "./components/layout/PageHeader";
import { OpearatorTable } from "./components/staking/Operators";


function Staking () {
  const theme = useTheme();

  const columns = useMemo(
    () => [
      {
        Header: 'name',
        accessor: 'name',
      },
      {
        Header: 'total staked',
        accessor: 'totalStaked',
      },
      {
        Header: 'commision rate',
        accessor: 'commisionRate',
      },
      {
        Header: 'your staked',
        accessor: 'yourStaked',
      },
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({row}: {row: any}) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <IconClose /> : <IconOpen />}
          </span>
        ),
      },
    ],
    [],
  );
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const { operatorList } = useOperatorList()
  console.log(operatorList)
  const renderRowSubComponent = useCallback(() => {}, [])
  
  return (
    <Flex minH={'80vh'} w={'100%'} mt={'36px'} flexDir={'column'} alignItems={'center'}>
      <PageHeader title={'Select your Operator'} subtitle={'You can select an operator to stake, restake, unstake, your TONS.'}/>
      <Box fontFamily={theme.fonts.roboto}>
        <OpearatorTable 
          renderDetail={renderRowSubComponent}
          columns={columns}
          data={operatorList}
          isLoading={tableLoading}
        />
      </Box>
    </Flex>
  );
}

export default Staking;