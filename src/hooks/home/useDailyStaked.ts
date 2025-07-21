import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { getTotalSupply, getTotalStaked } from "@/api";
import moment from "moment";
import {
	calculateRoi,
	calculateRoiBasedonCompound,
} from "@/components/calculateRoi";
import { useGetFactory, useGetGraphData } from "../graphql/useGetGraphData";

export function useDailyStaked() {
	const [dailyStaked, setDailyStaked] = useState<any[]>([]);
	const [totalStaked, setTotalStaked] = useState<number>(0);

	const { factories } = useGetFactory();
	const { stakingDayDatas } = useGetGraphData();

	useEffect(() => {
		async function fetchData() {
			// const totalStakedCurrent: number = await getTotalStaked();
			const totalSup = await getTotalSupply();
			const stakeTotal = factories;
			const totalStake = parseFloat(stakeTotal) / Math.pow(10, 27);

			function pushToArray(date: number, stakeAmount: string) {
				const day = new Date(date * 1000);
				const fetchDay = moment(day).utc().format("YYYYMMDD");
				return {
					blockTime: date * 1000,
					fetchDateUTC: Number(fetchDay),
					totalSupply: stakeAmount,
				};
			}
			let filledData = [];
			if (factories && stakingDayDatas) {
				const day = 86400;
				const now = Math.floor(new Date().getTime() / 1000);
				const sinceLastday = Math.floor((now - stakingDayDatas[0].date) / day);

				for (let i = 1; i < sinceLastday + 1; i++) {
					const today = stakingDayDatas[0].date + day * i;
					if (today > 0) {
						filledData.push(pushToArray(today, stakingDayDatas[0].totalStaked));
					}
				}
				for (let i = 0; i < stakingDayDatas.length; i++) {
					filledData.push(
						pushToArray(
							stakingDayDatas[i].date,
							stakingDayDatas[i].totalStaked,
						),
					);
					// fill staked data in the middle of graph
					if (stakingDayDatas[i + 1]) {
						const gap = Math.floor(
							(stakingDayDatas[i].date - stakingDayDatas[i + 1].date) / day,
						);
						for (let j = 1; j < gap; j++) {
							const date2 = stakingDayDatas[i].date - day;
							filledData.push(
								pushToArray(date2, stakingDayDatas[i + 1].totalStaked),
							);
						}
					}
				}
			}
			//@ts-ignore
			const setData = [...new Set(filledData.map(JSON.stringify))].map(
				JSON.parse,
			);

			const concatData = setData;
			const graphdata = concatData?.map((item: any, index) => {
				const totalStaked = parseFloat(item.totalSupply) / Math.pow(10, 27);
				let my = Number(1000);
				let stakedRatio = 0;
				const unit = 365;
				const maxCompensate = Number("26027.39726");
				const total = Number(totalStaked) + my;
				stakedRatio = total / totalSup;
				const compensatePerDay = stakedRatio * 26027.39726;
				const dailyNotMintedSeig =
					maxCompensate - maxCompensate * (total / totalSup);
				const proportionalSeig = dailyNotMintedSeig * (40 / 100);
				const expectedSeig =
					(my / total) * (Number(compensatePerDay) + proportionalSeig) * unit;
				my = my + expectedSeig;

				const test = calculateRoiBasedonCompound({
					totalStakedAmount: totalStaked,
					totalSupply: totalSup,
					duration: "1-year",
					fetchDateUTC: item.fetchDateUTC,
				});

				let roi = (test / 100).toLocaleString(undefined, {
					maximumFractionDigits: 2,
					minimumFractionDigits: 2,
				});

				let fixedData = {
					...item,
					roi,
				};
				return fixedData;
			});

			setDailyStaked(graphdata);
			setTotalStaked(totalStake);
		}
		fetchData();
	}, [factories, stakingDayDatas]);
	return { dailyStaked, totalStaked };
}
