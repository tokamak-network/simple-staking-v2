import { Button, Flex, Text, useTheme } from "@chakra-ui/react";
import Image from "next/image";
import { GraphSideContainer } from "./graph/GraphSideContainer";
import { useAccumulatedReward } from "@/hooks/wallet/useAccumulatedReward";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import calender_back_icon_inactive from "assets/images/calender_back_icon_inactive@3x.png";
import calender_Forward_icon_inactive from "assets/images/calender_Forward_icon_inactive@3x.png";
import select1_arrow_inactive from "assets/images/select-1-arrow-inactive@3x.png";
import select1_arrow_active from "assets/images/select1_arrow_active@3x.png";
import { range } from "lodash";

function GraphContainer() {
  const theme = useTheme();
  const { accumulatedReward } = useAccumulatedReward();
  const [showYear, setShowYear] = useState(false);
  const [showMonths, setShowMonths] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );
  const [endDate, setEndDate] = useState(new Date());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = range(1990, new Date().getFullYear() + 1, 1);

  const setWeek = () => {
    setStartDate(new Date(new Date().setDate(new Date().getDate() - 7)));
  };
  const setMonth = () => {
    setStartDate(new Date(new Date().setDate(new Date().getDate() - 30)));
  };
  return (
    <Flex
      flexDir={"column"}
      w={"1100px"}
      h={"467px"}
      paddingY={"15px"}
      bg={"#fff"}
      borderRadius={"10px"}
      boxShadow={"0 1px 1px 0 rgba(96, 97, 112, 0.16)"}
      justifyContent={"center"}
      alignItems={"center"}
      mt={"30px"}
    >
      <Flex
        flexDir={"row"}
        h={"73px"}
        w={"100%"}
        px={"24px"}
        pb={"6px"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Flex alignItems={"space-around"}>
          <Text mr="50px" fontSize={"20px"} fontWeight={500}>
            Reward
          </Text>
          <Flex>
            <Button
              {...theme.btnStyle.btnWalletPeriod()}
              mr={"10px"}
              onClick={() => setWeek()}
              _hover={{
                bg: "transparent",
                borderColor: "blue.200",
                color: "blue.200",
              }}
              _focus={{
                bg: "transparent",
                borderColor: "blue.200",
                color: "blue.200",
              }}
            >
              Week
            </Button>
            <Button
              {...theme.btnStyle.btnWalletPeriod()}
              onClick={() => setMonth()}
              _hover={{
                bg: "transparent",
                borderColor: "blue.200",
                color: "blue.200",
              }}
              _focus={{
                bg: "transparent",
                borderColor: "blue.200",
                color: "blue.200",
              }}
            >
              Month
            </Button>
          </Flex>
        </Flex>
        <style>
          {` .react-datepicker-ignore-onclickoutside {
          outline: none;
          width:70px
        }
        .react-datepicker-wrapper{
          width: 70px
        } 
        input {
          width: 100%
        }
        .react-datepicker__header {
          background-color: #fff
        }
        .react-datepicker-popper{
          width: 300px;
         
        }
        .react-datepicker .react-datepicker__header  {
          width: 300px;
        }
        .react-datepicker{
        
          border-radius: 4px;
          box-shadow: 0 2px 4px 0 rgba(96, 97, 112, 0.14);
          border:none;
          margin-top: 5px
        }
        .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
          display: none
        }
        .react-datepicker__triangle {
          display: none
        }
        .react-datepicker__header {
          border-bottom: none
        }
        .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name{
          width:28px;
         margin-top:12px;
          margin-left:4.5px;
          margin-right:4.5px;
        }
        .react-datepicker__day--selected{
          border-radius:50%;
          background-color:#2a72e5;
        }
.react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range,
{
  border-radius:50%;
  background-color:#2a72e5;
}
.react-datepicker__day--selected:hover, .react-datepicker__day--in-selecting-range:hover, .react-datepicker__day--in-range:hover,
{
  border-radius:50%;
  background-color:#2a72e5;
}
.react-datepicker__day--selected, 
.react-datepicker__day--in-selecting-range, 
.react-datepicker__day--in-range,
{
  border-radius:50%;
  background-color:#2a72e5;
}
.react-datepicker__day--selected:hover, .react-datepicker__day--in-selecting-range:hover, .react-datepicker__day--in-range:hover,
.react-datepicker__month-text--selected:hover,
.react-datepicker__month-text--in-selecting-range:hover,
.react-datepicker__month-text--in-range:hover,
.react-datepicker__quarter-text--selected:hover,
.react-datepicker__quarter-text--in-selecting-range:hover,
.react-datepicker__quarter-text--in-range:hover,
.react-datepicker__year-text--in-selecting-range:hover,
.react-datepicker__year-text--in-range:hover {
  background-color: #2a72e5;
  border-radius:50%;

}
.react-datepicker__month-text--keyboard-selected {
  background-color: #2a72e5;
  border-radius:3px;
}
.react-datepicker__month-text--keyboard-selected:hover {
  background-color: #2a72e5;
  border-radius:3px;
}
.react-datepicker__year-text--selected{
  background-color: #2a72e5;
  border-radius:3px;
}
.react-datepicker__year-text--selected:hover{
  background-color: #2a72e5;
  border-radius:3px;
}

.react-datepicker__month-text.react-datepicker__month--selected:hover, .react-datepicker__month-text.react-datepicker__month--in-range:hover, .react-datepicker__month-text.react-datepicker__quarter--selected:hover, .react-datepicker__month-text.react-datepicker__quarter--in-range:hover,
.react-datepicker__quarter-text.react-datepicker__month--selected:hover,
.react-datepicker__quarter-text.react-datepicker__month--in-range:hover,
.react-datepicker__quarter-text.react-datepicker__quarter--selected:hover,
.react-datepicker__quarter-text.react-datepicker__quarter--in-range:hover{
  background-color: #2a72e5;
}
.react-datepicker__month .react-datepicker__month-text, .react-datepicker__month .react-datepicker__quarter-text {  
  width:80px;
display: inline-flex;
  align-items:center;
  justify-content: center;
  margin-right:7.5px;
  margin-left:7.5px;
  margin-bottom:15px;
  height:35px
}
.react-datepicker__year .react-datepicker__year-text {
  width:80px;
  display: inline-flex;
    align-items:center;
    justify-content: center;
    margin-right:7.5px;
    margin-left:7.5px;
    margin-bottom:15px;
    height:35px
}
.react-datepicker__year-wrapper {
  max-width: none
}
.react-datepicker__day--keyboard-selected, .react-datepicker__month-text--keyboard-selected, .react-datepicker__quarter-text--keyboard-selected, .react-datepicker__year-text--keyboard-selected {
  background-color: #2a72e5;
}

.react-datepicker__day--keyboard-selected:hover,
.react-datepicker__month-text--keyboard-selected:hover,
.react-datepicker__quarter-text--keyboard-selected:hover,
.react-datepicker__year-text--keyboard-selected:hover{
  background-color: #2a72e5;

}
.react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range {
  background-color: #2a72e5;
  border-radius:50%;
}
.react-datepicker__day:hover {
  border-radius:50%;
}
.react-datepicker__day--keyboard-selected, .react-datepicker__quarter-text--keyboard-selected, .react-datepicker__year-text--keyboard-selected {
  border-radius:50%;
}
.react-datepicker__day--outside-month {
  color:#c7d1d8
}

        `}
        </style>
        <Flex>
          <Flex
            border={"1px solid #dfe4ee"}
            h="32px"
            w="105px"
            borderRadius={"4px"}
            justifyContent="center"
            alignItems={"center"}
            fontSize="13px"
            mr="5px"
          >
            <DatePicker
              selectsStart
              selected={startDate}
              showYearPicker={showYear}
              showMonthYearPicker={showMonths}
              showMonthDropdown
              showYearDropdown
              showFullMonthYearPicker
              onChange={(date: Date) => setStartDate(date)}
              dateFormat="yyyy.MM.dd"
              renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                decreaseYear,
                increaseMonth,
                increaseYear,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div
                  style={{
                    height: 47,
                    marginTop: "-10px",
                    borderBottom: "1px solid #dfe3e9",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <button
                    onClick={showYear ? decreaseYear : decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    style={{ background: "transparent", marginLeft: "13px" }}
                  >
                    <Image
                      src={calender_back_icon_inactive}
                      alt={"back"}
                      width={16}
                      height={16}
                    />
                  </button>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={() => setShowMonths(!showMonths)}
                      style={{
                        display: "flex",
                        background: "transparent",
                        alignItems: "center",
                        flexDirection: "row",
                        fontSize: "14px",
                        fontWeight: 500,
                        marginRight: "10px",
                      }}
                    >
                      {months[date.getMonth()]}
                      <Flex ml={"5px"}>
                        <Image
                          src={
                            showMonths
                              ? select1_arrow_active
                              : select1_arrow_inactive
                          }
                          alt={""}
                          width={9}
                          height={9}
                        />
                      </Flex>
                    </button>

                    <button
                      onClick={() => setShowYear(!showYear)}
                      style={{
                        display: "flex",
                        background: "transparent",
                        alignItems: "center",
                        flexDirection: "row",
                        fontSize: "14px",
                        fontWeight: 500,
                        marginRight: "10px",
                      }}
                    >
                      {date.getFullYear()}
                      <Flex ml={"5px"}>
                        <Image
                          src={
                            showYear
                              ? select1_arrow_active
                              : select1_arrow_inactive
                          }
                          alt={""}
                          width={9}
                          height={9}
                        />
                      </Flex>
                    </button>
                  </div>

                  <button
                    onClick={showYear ? increaseYear : increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    style={{ background: "transparent", marginRight: "13px" }}
                  >
                    <Image
                      src={calender_Forward_icon_inactive}
                      alt={"back"}
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              )}
            />
          </Flex>
          <Text mr="5px"> ~ </Text>
          <Flex
            border={"1px solid #dfe4ee"}
            h="32px"
            w="105px"
            borderRadius={"4px"}
            justifyContent="center"
            alignItems={"center"}
            fontSize="13px"
            mr="5px"
          >
            <DatePicker
              selected={endDate}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              showFullMonthYearPicker
              onChange={(date: Date) => setEndDate(date)}
              dateFormat="yyyy.MM.dd"
              renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                decreaseYear,
                increaseMonth,
                increaseYear,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div
                  style={{
                    height: 47,
                    marginTop: "-10px",
                    borderBottom: "1px solid #dfe3e9",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <button
                    onClick={showYear ? decreaseYear : decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    style={{ background: "transparent", marginLeft: "13px" }}
                  >
                    <Image
                      src={calender_back_icon_inactive}
                      alt={"back"}
                      width={16}
                      height={16}
                    />
                  </button>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={() => setShowMonths(!showMonths)}
                      style={{
                        display: "flex",
                        background: "transparent",
                        alignItems: "center",
                        flexDirection: "row",
                        fontSize: "14px",
                        fontWeight: 500,
                        marginRight: "10px",
                      }}
                    >
                      {months[date.getMonth()]}
                      <Flex ml={"5px"}>
                        <Image
                          src={
                            showMonths
                              ? select1_arrow_active
                              : select1_arrow_inactive
                          }
                          alt={""}
                          width={9}
                          height={9}
                        />
                      </Flex>
                    </button>

                    <button
                      onClick={() => setShowYear(!showYear)}
                      style={{
                        display: "flex",
                        background: "transparent",
                        alignItems: "center",
                        flexDirection: "row",
                        fontSize: "14px",
                        fontWeight: 500,
                        marginRight: "10px",
                      }}
                    >
                      {date.getFullYear()}
                      <Flex ml={"5px"}>
                        <Image
                          src={
                            showYear
                              ? select1_arrow_active
                              : select1_arrow_inactive
                          }
                          alt={""}
                          width={9}
                          height={9}
                        />
                      </Flex>
                    </button>
                  </div>

                  <button
                    onClick={showYear ? increaseYear : increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    style={{ background: "transparent", marginRight: "13px" }}
                  >
                    <Image
                      src={calender_Forward_icon_inactive}
                      alt={"back"}
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              )}
            />
          </Flex>
          <Button {...theme.btnStyle.btnWalletSearch()}>Search</Button>
        </Flex>
      </Flex>
      <Flex h={"393px"} borderTop={"1px"} borderColor={"#f4f6f8"} w={"100%"}>
        <Flex w={"982px"}></Flex>
        <Flex w={"230px"} flexDir={"column"}>
          <GraphSideContainer
            totalReward={accumulatedReward}
            totalStaked={""}
            totalWithdraw={""}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default GraphContainer;
