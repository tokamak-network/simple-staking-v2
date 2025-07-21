import { Button, Flex, Text, useTheme } from "@chakra-ui/react";
import Image from "next/image";

import calender_back_icon_inactive from "assets/images/calender_back_icon_inactive@3x.png";
import calender_Forward_icon_inactive from "assets/images/calender_Forward_icon_inactive@3x.png";
import select1_arrow_inactive from "assets/images/select-1-arrow-inactive@3x.png";
import select1_arrow_active from "assets/images/select1_arrow_active@3x.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { range } from "lodash";
import { useState, useEffect, SetStateAction } from "react";

function Calendar(props: {
	date: Date;
	selectsEnd: boolean;
	selectsStart: boolean;
	setDate: React.Dispatch<SetStateAction<Date>>;
	startDate?: Date;
	endDate?: Date;
	minDate?: Date;
}) {
	const {
		date,
		setDate,
		selectsEnd,
		selectsStart,
		startDate,
		endDate,
		minDate,
	} = props;
	const [showYear, setShowYear] = useState(false);
	const [showMonths, setShowMonths] = useState(false);
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

	return (
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
				selectsStart={selectsStart}
				selectsEnd={selectsEnd}
				selected={date}
				startDate={startDate}
				endDate={endDate}
				minDate={minDate}
				showYearPicker={showYear}
				showMonthYearPicker={showMonths}
				showMonthDropdown
				showYearDropdown
				showFullMonthYearPicker
				onChange={(date: Date) => setDate(date)}
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
											showMonths ? select1_arrow_active : select1_arrow_inactive
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
											showYear ? select1_arrow_active : select1_arrow_inactive
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
	);
}

export default Calendar;
