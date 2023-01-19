import { Box, Flex, Text, useMediaQuery, useTheme } from "@chakra-ui/react";
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
  const theme = useTheme();
  const { dailyStaked, totalStaked } = useDailyStaked();
  const [dailyStakes, setDailyStakes] = useState<any[]>();

  useEffect(() => {
    if (dailyStaked !== undefined) {
      const ordered = orderBy(dailyStaked, (staked: any) => staked.blockTime, [
        "asc",
      ]);
      setDailyStakes(ordered);
    }
    // setDailyStakes()
  }, [dailyStaked]);

  const displayAmount = (amount: string) => {
    const displayAmounts = parseFloat(amount) / Math.pow(10, 27);
    return Math.round(displayAmounts * 10) / 10;
  };

  const getLatestData = () => {
    const result: any[] = [];
    dailyStakes?.map((item: any, index: number) => {
      if (index === dailyStakes.length - 1) {
        const test = totalStaked.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        });
        return result.push(Number(test.replace(/,/g, "")));
      }
      result.push(displayAmount(item.totalSupply));
    });
    return result;
  };
  const getData = () => {
    const latesData = getLatestData();
    const roi = dailyStakes?.map((item: any) => item.roi);

    return {
      labels: dailyStakes?.map((item: any) =>
        moment(item.blockTime).format("YYYY.MM.DD")
      ),
      datasets: [
        {
        
          data: latesData,
          borderColor: "#2a72e5",
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 0,
          lineTension: 0,
          pointHitRadius: 10,
          yAxisID: "y",
        },
        {
         
          data: roi,
          borderColor: "#C7D1D8",
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 0,
          lineTension: 0,
          pointHitRadius: 10,
          yAxisID: "y1",
        },
      ],
    };
  };

  const externalTooltipHandler = (context:any) => {
    let testX = 0;
    let testY = 0;
    let valueLength = 0;
    const {chart, tooltip} = context;
    if (tooltip.dataPoints !== undefined) {
      const typeAPY = typeof(tooltip.dataPoints[0].raw) === 'string';      
      let tooltipEl = chart.canvas.parentNode.querySelector('div');      
      if (!tooltipEl) {
       
        
        tooltipEl = document.createElement('div');
        tooltipEl.style.borderRadius = '3px';
        tooltipEl.style.color = 'white';
        tooltipEl.style.display = 'flex'
        tooltipEl.style.justifyContent = 'center'
        tooltipEl.style.opacity = 1;
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.transform = 'translate(-50%, -135%)';
        tooltipEl.style.transition = 'all .1s ease';

        // tooltipEl.style.after = '';
        const table = document.createElement('table');
        const triangle = document.createElement('div');
        table.style.margin = '0px';
        triangle.style.width ='0'
        triangle.style.height ='0'
        triangle.style.borderLeft = '6px solid transparent';
        triangle.style.borderRight = '6px solid transparent';
       
        triangle.style.position='absolute'
        triangle.style.top='51px'

        tooltipEl.appendChild(table);
        tooltipEl.appendChild(triangle)
        chart.canvas.parentNode.appendChild(tooltipEl);
      }
  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b:any) => b.lines);

    const tableHead = document.createElement('thead');

    titleLines.forEach((title:string) => {
      const tr = document.createElement('tr');
      tr.style.borderWidth = '0';
      tr.style.fontSize = '12px';
      tr.style.textAlign = 'left';
      tr.style.fontWeight = 'normal';
      const th = document.createElement('th');
      th.style.borderWidth = '0';
      const text = document.createTextNode(title);

      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableBody = document.createElement('tbody');
    bodyLines.forEach((body:any, i:number) => {

      const textFormatted = typeAPY? 'APY ' + Number(body) * 100 + '%'
      : String(body)
        .replace(/[^0-9a-zA-Z.]/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' TON';
      const colors = tooltip.labelColors[i];

    

      const tr = document.createElement('tr');
      tr.style.backgroundColor = 'inherit';
      tr.style.borderWidth = '0';

      const td = document.createElement('td');
      td.style.borderWidth = '0';
      tr.style.fontSize = '16px';
      tr.style.fontWeight = '600'
      tr.style.padding = '0px'
      const text = document.createTextNode(textFormatted);      

      td.appendChild(text);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });

    const tableRoot = tooltipEl.querySelector('table');

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);
    
    }
    const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
   const triangle = tooltipEl.querySelector('div')
    
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.width = typeAPY? '100px':'170px'
    tooltipEl.style.height = '52px'
    tooltipEl.style.background = typeAPY? "#84919e":'#2a72e5';
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
    triangle.style.borderTop = typeAPY? '6px solid #84919e':'6px solid #2a72e5' ;
  }
  }
  const getOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip : {
          enabled:false,
          external: externalTooltipHandler
        }
      },
      scales: {
        // ticks: { min: 0 },
        x: {
          display: false,
        },
        y: {
          display: false,
          stacked: true,
        },
        y1: {
          display: false,
          stacked: true,
        },
      },
   
    };
  };

  // getLatestData()
  return (
    <Box  w={"100%"} mt={"36px"}>
      <Flex
        flexDir={"column"}
        alignItems={"center"}
        fontSize={"32px"}
        fontWeight={600}
        pos={"relative"}
        height={'70vh'}
      >
        <Image src={MAP} alt={"map"}></Image>
        <Flex
          position={"absolute"}
          flexDir={"column"}
          alignItems={"center"}
          width={"100%"}
       
        >
          <Text h={"58px"} fontFamily={theme.fonts.TitilliumWeb}>
            There is currently
          </Text>
          {/* <Text
            color={"#2a72e5"}
            h={"76px"}
            mt={"25px"}
            fontFamily={theme.fonts.TitilliumWeb}
          >
            {} TON
          </Text> */}
          <RollingNumbers totalStaked={totalStaked}/>
          <Text
            h={"48px"}
            color={"#3d495d"}
            mt={"25px"}
            fontFamily={theme.fonts.TitilliumWeb}
          >
            Staked in the
          </Text>
          <Text
            h={"42px"}
            mt={"20px"}
            fontSize={"38px"}
            fontFamily={theme.fonts.Nanum}
          >
            Tokamak Network
          </Text>
          <Flex flexDir={"column"} mt="30px">
            <Flex alignItems={"center"}>
              <Flex h="2px" w="15px" bg={"blue.200"} mr="10px" />
              <Text
                color={"gray.500"}
                mr="20px"
                fontSize="13px"
                fontFamily={theme.fonts.TitilliumWeb}
              >
                {" "}
                Total Stake
              </Text>
              <Flex h="2px" w="15px" bg={"gray.600"} mr="10px" />
              <Text
                color={"gray.500"}
                mr="20px"
                fontSize="13px"
                fontFamily={theme.fonts.TitilliumWeb}
              >
                {" "}
                Actual APY
              </Text>
            </Flex>
          </Flex>
          <Flex height={250} width={"100%"} >
            <Line data={getData()} options={getOptions()} />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Home;
