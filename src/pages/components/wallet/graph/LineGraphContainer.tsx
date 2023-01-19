import { Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type LineGraphContainerProps = {
  options: any;
  data: any;
};

export const LineGraphContainer: FC<LineGraphContainerProps> = ({
  options,
  data,
}) => {
  return (
    <Flex w={"982px"} p={"30px 30px 15px 30px"}>
      <Line options={options} data={data} style={{ width: "854px" }} />
    </Flex>
  );
};

export default LineGraphContainer
