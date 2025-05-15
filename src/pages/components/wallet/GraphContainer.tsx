import { Button, calc, Flex, Text, useTheme } from '@chakra-ui/react';
import { GraphSideContainer } from '@/common/graph/GraphSideContainer';
import { useDailyWalletRewards } from '@/hooks/wallet/useDailyWalletRewards';
import { useDailyStaked } from '@/hooks/wallet/useDailyStaked';
import { useDailyWithdrawals } from '@/hooks/wallet/useDailyWithdrawals';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect } from 'react';
import { range } from 'lodash';
import { convertNumber } from 'utils/number';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import { LineGraphContainer } from '@/common/graph/LineGraphContainer';
import { useWeb3React } from '@web3-react/core';
import Calendar from './Calendar';
function GraphContainer() {
  const theme = useTheme();
  const { library } = useWeb3React();
  const { dailyStakedAmnts } = useDailyStaked();
  const { dailyWithdrawAmnts } = useDailyWithdrawals();
  const [calculatedReward, setCalculatedReward] = useState<string>('');
  const [calculatedStakes, setCalculatedStakes] = useState<string>('');
  const [labels, setLabels] = useState<string[]>();
  const [calculatedWithdrawals, setCalculatedWithdrawals] =
    useState<string>('');
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );
  const [period, setPeriod] = useState('week');
  const [endDate, setEndDate] = useState(new Date());
  const periodStart = moment(startDate).format('YYYYMMDD');
  const periodEnd = moment(endDate).format('YYYYMMDD');
  const { fetchData, dailyWalletRewards } = useDailyWalletRewards(
    periodStart,
    periodEnd
  );

  const [dailyRewards, setDailyRewards] = useState<any[]>([]);

  const calcTotalReward = () => {
    const initialAmount = new BigNumber('0');
    const reducer = (amount: any, day: any) =>
      amount.plus(new BigNumber(day.rewards.toString()));
    const rewards = dailyRewards.reduce(reducer, initialAmount);
    const convertedWTon = convertNumber({
      type: 'ray',
      amount: rewards.toString(),
      localeString: true,
    });

    convertedWTon !== undefined && setCalculatedReward(convertedWTon);
  };

  const calcTotal = (dailyStakes: any) => {
    const initialAmount = new BigNumber('0');
    const reducer = (amount: any, day: any) =>
      amount.plus(new BigNumber(day.value.toString()));

    const stakes = dailyStakes.reduce(reducer, initialAmount);
    const convertedWTon = convertNumber({
      type: 'ray',
      amount: stakes.toString(),
      localeString: true,
    });
    return convertedWTon;
  };

  useEffect(() => {
    calcTotalReward();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, dailyRewards]);

  const getData = async () => {
    await fetchData(periodStart, periodEnd);
  };

  useEffect(() => {
    if (dailyWalletRewards !== undefined) {
      setDailyRewards(dailyWalletRewards);
    }
  }, [dailyWalletRewards]);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const years = range(1990, new Date().getFullYear() + 1, 1);

  const setWeek = () => {
    setPeriod('week');
    setStartDate(new Date(new Date().setDate(new Date().getDate() - 7)));
    fetchData(
      moment(new Date(new Date().setDate(new Date().getDate() - 7))).format(
        'YYYYMMDD'
      ),
      moment(endDate).format('YYYYMMDD')
    );
  };
  const setMonth = () => {
    setPeriod('month');
    setStartDate(new Date(new Date().setDate(new Date().getDate() - 30)));
    fetchData(
      moment(new Date(new Date().setDate(new Date().getDate() - 30))).format(
        'YYYYMMDD'
      ),
      moment(endDate).format('YYYYMMDD')
    );
  };

  const formatDate = (date: Number) => {
    return (
      date.toString().substring(0, 4) +
      '/' +
      date.toString().substring(4, 6) +
      '/' +
      date.toString().substring(6, 8)
    );
  };

  const formatFilter = async (array: any) => {
    const formatted = await Promise.all(
      array.map(async (item: any) => {
        const block = await library.getBlock(item.blockNumber);
        item.blkTimestamp = block.timestamp;
        return item;
      })
    );
    const start = moment(startDate).unix();
    const end = moment(endDate).unix();
    const filtered = formatted.filter(
      (item: any) => start <= item.blkTimestamp && item.blkTimestamp <= end
    );

    return filtered;
  };

  const search = async () => {
    getData();
    calcTotalReward();
    const filteredStakes = await formatFilter(dailyStakedAmnts);
    const filteredWithdrawals = await formatFilter(dailyWithdrawAmnts);
    const calcTotalStakes = calcTotal(filteredStakes);
    calcTotalStakes !== undefined && setCalculatedStakes(calcTotalStakes);
    const calcTotalWithdrawals = calcTotal(filteredWithdrawals);
    calcTotalWithdrawals !== undefined &&
      setCalculatedWithdrawals(calcTotalWithdrawals);
  };

  const displayAmount = (amount: any) => {
    const displayAmounts = parseFloat(amount) / Math.pow(10, 27);
    return Math.round(displayAmounts * 10) / 10;
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: '#f0f1f2',
        },
      },
      y: {
        grid: {
          display: true,
          color: '#f0f1f2',
        },
        min: 0,
      },
    },
  };

  useEffect(() => {
    if (dailyRewards) {
      const label = dailyRewards
        .map((reward: any) => formatDate(reward._id.dateUTC))
        .reverse();

      setLabels(label)
    }
  }, [dailyRewards])
  

  const data = {
    labels,
    datasets: [
      {
        data: dailyRewards
          .map((reward: any) => displayAmount(reward.rewards))
          .reverse(),
        borderColor: '#2a72e5',
        backgroundColor: '#2a72e5',
      },
    ],
  };

  return (
    <Flex
      flexDir={'column'}
      w={'1100px'}
      h={'467px'}
      paddingY={'15px'}
      bg={'#fff'}
      borderRadius={'10px'}
      boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
      justifyContent={'center'}
      alignItems={'center'}
      mt={'30px'}
    >
      <Flex
        flexDir={'row'}
        h={'73px'}
        w={'100%'}
        px={'24px'}
        pb={'6px'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Flex alignItems={'space-around'}>
          <Text mr='50px' fontSize={'20px'} fontWeight={500}>
            Reward
          </Text>
          <Flex>
            <Button
              {...theme.btnStyle.btnWalletPeriod()}
              color={period === 'week' && 'blue.200'}
              borderColor={period === 'week' && 'blue.200'}
              mr={'10px'}
              onClick={() => setWeek()}
              _hover={{
                bg: 'transparent',
                borderColor: 'blue.200',
                color: 'blue.200',
              }}
              _focus={{
                bg: 'transparent',
                borderColor: 'blue.200',
                color: 'blue.200',
              }}
            >
              Week
            </Button>
            <Button
              {...theme.btnStyle.btnWalletPeriod()}
              color={period === 'month' && 'blue.200'}
              borderColor={period === 'month' && 'blue.200'}
              onClick={() => setMonth()}
              _hover={{
                bg: 'transparent',
                borderColor: 'blue.200',
                color: 'blue.200',
              }}
              _focus={{
                bg: 'transparent',
                borderColor: 'blue.200',
                color: 'blue.200',
              }}
            >
              Month
            </Button>
          </Flex>
        </Flex>
        <style>
          {`.react-datepicker-ignore-onclickoutside {
  outline: none;
  width: 70px;
}
.react-datepicker-wrapper {
  width: 70px;
}
input {
  width: 100%;
}
.react-datepicker__header {
  background-color: #fff;
}
.react-datepicker-popper {
  width: 300px;
}
.react-datepicker .react-datepicker__header {
  width: 300px;
}
.react-datepicker {
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(96, 97, 112, 0.14);
  border: none;
  margin-top: 5px;
}
.react-datepicker__current-month,
.react-datepicker-time__header,
.react-datepicker-year-header {
  display: none;
}
.react-datepicker__triangle {
  display: none;
}
.react-datepicker__header {
  border-bottom: none;
}
.react-datepicker__day-name,
.react-datepicker__day,
.react-datepicker__time-name {
  width: 28px;
  margin-top: 12px;
  margin-left: 4.5px;
  margin-right: 4.5px;
}
.react-datepicker__day--selected {
  border-radius: 50%;
  background-color: #2a72e5;
}

.react-datepicker__day--selected,
.react-datepicker__day--in-selecting-range,
.react-datepicker__day--in-range {
  border-radius: 50%;
  background-color: #2a72e5;
}
.react-datepicker__day--selected:hover,
.react-datepicker__day--in-selecting-range:hover,
.react-datepicker__day--in-range:hover {
  border-radius: 50%;
  background-color: #2a72e5;
}
.react-datepicker__day--selected,
.react-datepicker__day--in-selecting-range,
.react-datepicker__day--in-range {
  border-radius: 50%;
  background-color: #2a72e5;
}
.react-datepicker__day--selected:hover,
.react-datepicker__day--in-selecting-range:hover,
.react-datepicker__day--in-range:hover,
.react-datepicker__month-text--selected:hover,
.react-datepicker__month-text--in-selecting-range:hover,
.react-datepicker__month-text--in-range:hover,
.react-datepicker__quarter-text--selected:hover,
.react-datepicker__quarter-text--in-selecting-range:hover,
.react-datepicker__quarter-text--in-range:hover,
.react-datepicker__year-text--in-selecting-range:hover,
.react-datepicker__year-text--in-range:hover {
  background-color: #2a72e5;
  border-radius: 50%;
}
.react-datepicker__month-text--keyboard-selected {
  background-color: #2a72e5;
  border-radius: 3px;
}
.react-datepicker__month-text--keyboard-selected:hover {
  background-color: #2a72e5;
  border-radius: 3px;
}
.react-datepicker__year-text--selected {
  background-color: #2a72e5;
  border-radius: 3px;
}
.react-datepicker__year-text--selected:hover {
  background-color: #2a72e5;
  border-radius: 3px;
}

.react-datepicker__month-text.react-datepicker__month--selected:hover,
.react-datepicker__month-text.react-datepicker__month--in-range:hover,
.react-datepicker__month-text.react-datepicker__quarter--selected:hover,
.react-datepicker__month-text.react-datepicker__quarter--in-range:hover,
.react-datepicker__quarter-text.react-datepicker__month--selected:hover,
.react-datepicker__quarter-text.react-datepicker__month--in-range:hover,
.react-datepicker__quarter-text.react-datepicker__quarter--selected:hover,
.react-datepicker__quarter-text.react-datepicker__quarter--in-range:hover {
  background-color: #2a72e5;
}
.react-datepicker__month .react-datepicker__month-text,
.react-datepicker__month .react-datepicker__quarter-text {
  width: 80px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 7.5px;
  margin-left: 7.5px;
  margin-bottom: 15px;
  height: 35px;
}
.react-datepicker__year .react-datepicker__year-text {
  width: 80px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 7.5px;
  margin-left: 7.5px;
  margin-bottom: 15px;
  height: 35px;
}
.react-datepicker__year-wrapper {
  max-width: none;
}
.react-datepicker__day--keyboard-selected,
.react-datepicker__month-text--keyboard-selected,
.react-datepicker__quarter-text--keyboard-selected,
.react-datepicker__year-text--keyboard-selected {
  background-color: #2a72e5;
}

.react-datepicker__day--keyboard-selected:hover,
.react-datepicker__month-text--keyboard-selected:hover,
.react-datepicker__quarter-text--keyboard-selected:hover,
.react-datepicker__year-text--keyboard-selected:hover {
  background-color: #2a72e5;
}
.react-datepicker__day--in-selecting-range,
.react-datepicker__day--in-range {
  background-color: #2a72e5;
  border-radius: 50%;
}
.react-datepicker__day:hover {
  border-radius: 50%;
}
.react-datepicker__day--keyboard-selected,
.react-datepicker__quarter-text--keyboard-selected,
.react-datepicker__year-text--keyboard-selected {
  border-radius: 50%;
}
.react-datepicker__day--outside-month {
  color: #c7d1d8;
}
`}
        </style>
        <Flex>
          <Calendar
            date={startDate}
            selectsEnd={false}
            selectsStart={true}
            setDate={setStartDate}
          />
          <Text mr='5px'> ~ </Text>
          <Calendar
            date={endDate}
            selectsEnd={true}
            selectsStart={false}
            setDate={setEndDate}
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />

   
          <Button
            {...theme.btnStyle.btnWalletSearch()}
            onClick={() => search()}
          >
            Search
          </Button>
        </Flex>
      </Flex>
      <Flex h={'393px'} borderTop={'1px'} borderColor={'#f4f6f8'} w={'100%'}>
        <LineGraphContainer options={options} data={data} />
        <Flex w={'230px'} flexDir={'column'}>
          <GraphSideContainer
            totalReward={calculatedReward}
            totalStaked={calculatedStakes}
            totalWithdraw={calculatedWithdrawals}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default GraphContainer;
