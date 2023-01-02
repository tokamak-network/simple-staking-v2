import { Flex, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { LineChart, YAxis, XAxis, CartesianGrid, Line } from 'recharts';

type GraphSideComponentProps = {
  title: string;
  value: string;
}

export const GraphSideComponent: FC<GraphSideComponentProps> = ({
  title,
  value
}) => {
  return(
    <Flex 
      
    >
      <LineChart width={651} height={351}>

      </LineChart>
     
    </Flex>
  )
}