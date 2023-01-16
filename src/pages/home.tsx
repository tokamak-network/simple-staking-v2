import { Box, Flex, Text, useMediaQuery, useTheme } from "@chakra-ui/react";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import MAP from "@/assets/images/map.png";
import Image from "next/image";
import { useDailyStaked } from "@/hooks/home/useDailyStaked";
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
import moment from "moment";
import { orderBy } from "lodash";
import { useEffect, useState } from "react";
import RollingNumbers from "./components/home/RollingNumbers";
import DesktopHome from "./components/home/DesktopHome";
import MobileHome from "./components/home/MobileHome";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  const [width] = useWindowDimensions();
  const mobile = width < 460;

  // getLatestData()
  return (
    <>
      {mobile? <MobileHome/>: 
      <DesktopHome/>
    }
    </>
   
  );
}

export default Home;
