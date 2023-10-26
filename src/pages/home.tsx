import { useWindowDimensions } from "@/hooks/useWindowDimensions";

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
  const mobile = width < 1040;

  return (
    <>
      {
        !mobile ?  
        <DesktopHome/> :
        <MobileHome/>
      }
    </>
   
  );
}

export default Home;
