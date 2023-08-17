import { Box, Flex, Spinner, Text, useMediaQuery, useTheme } from "@chakra-ui/react";
import { useMemo, useCallback, useState } from 'react';
import { IconClose } from "@/common/Icons/IconClose";
import { IconOpen } from "@/common/Icons/IconOpen";

import { SequencerTable } from "@/common/table/stakingv2/SequencerTable";
import PageHeader from "./components/layout/PageHeader";

function StakingV2 () {
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

  return (
    <Flex minH={'80vh'} w={'100%'} mt={'36px'} flexDir={'column'} alignItems={'center'}>
      <PageHeader title={'TON Staking v2'} subtitle={'Select an L2 and stake, unstatke, re-stake or withdraw TON!'}/>
      <Box fontFamily={theme.fonts.roboto}>
        {tableLoading ? 
          <Flex justifyContent="center" alignItems={"center"} h='200px'>
            <Spinner size="md" emptyColor="gray.200" color="#2775ff" />
          </Flex> :
          <SequencerTable 
            columns={columns}
            // data={}
            isLoading={tableLoading}
          />
        }
      </Box>
    </Flex>
  );
}

export default StakingV2