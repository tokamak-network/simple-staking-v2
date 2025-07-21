import { ethers, BigNumber } from "ethers";
import Decimal from "decimal.js";
import { toWei } from "web3-utils";

// eslint-disable-next-line
type RoundFunc = {
	r_amount: string;
	r_maxDecimalDigits: number;
	r_opt?: "up" | "down" | "none";
	localeString?: boolean;
	decimalPoints?: number;
};

type ConverNumberFunc = {
	type?: "ray" | "wei";
	amount: string;
	round?: boolean;
	decimalPlaces?: number;
	localeString?: boolean;
	decimalPoints?: number;
};

export const floatParser = (num: string) => {
	try {
		if (num === "0") return;
		// console.log(num.indexOf(','))
		const parsed: number = parseFloat(num.replaceAll(",", ""));
		return parsed;
	} catch (e) {
		console.log(e);
	}
};

//temp
export const parseFromRayToWei = (num: BigNumber) => {
	const argBigNum = BigNumber.from(num);
	const weiNum = convertFromRayToWei(argBigNum.toString());
	return weiNum;
};

export const convertFromRayToWei = (num: string) => {
	const numAmount = BigNumber.from(num).div(10 ** 9);
	return numAmount;
};

export const convertFromWeiToRay = (num: string) => {
	const numAmount = BigNumber.from(num).mul(10 ** 9);
	return numAmount;
};

export const convertToWei = (num: string) => toWei(num, "ether");
export const convertToRay = (num: string) => toWei(num, "gether");

function roundNumber(args: RoundFunc): string {
	const { r_amount, r_maxDecimalDigits, r_opt, localeString, decimalPoints } =
		args;
	const displayPoint = decimalPoints || 2;
	const number = new Decimal(r_amount);

	if (r_opt === "up") {
		const res = number.toFixed(r_maxDecimalDigits, Decimal.ROUND_UP);
		const fixedNum = Number(res).toFixed(displayPoint);
		return localeString === true
			? Number(fixedNum).toLocaleString(undefined, {
					minimumFractionDigits: 2,
				})
			: Number(res).toFixed(displayPoint);
	} else if (r_opt === "down") {
		const res = number.toFixed(r_maxDecimalDigits, Decimal.ROUND_DOWN);
		const fixedNum = Number(res).toFixed(displayPoint);
		return localeString === true
			? Number(fixedNum).toLocaleString(undefined, {
					minimumFractionDigits: 2,
				})
			: Number(res).toFixed(displayPoint);
	}
	const res = number.toFixed(r_maxDecimalDigits, Decimal.ROUND_HALF_UP);
	const fixedNum = Number(res).toFixed(displayPoint);
	return localeString === true
		? Number(fixedNum).toLocaleString(undefined, { minimumFractionDigits: 2 })
		: Number(res).toFixed(displayPoint);
}

export function convertNumber(args: ConverNumberFunc): string | undefined {
	try {
		const { type, amount, round, decimalPlaces, localeString, decimalPoints } =
			args;
		const utils = ethers.utils;

		if (amount === "0" || amount === undefined || amount === "") {
			return "0.00";
		}
		const numAmount = BigNumber.from(amount);

		const numberType: string = type || "wei";
		const optRound = round || undefined;
		const decimalPoint: number = decimalPlaces || 2;
		if (amount === undefined) {
			throw new Error(`amount is undefined`);
		}
		if (decimalPoint <= 0) {
			throw new Error(`decimalPoint must be positive number`);
		}
		switch (numberType) {
			case "wei":
				const weiAmount = utils.formatUnits(numAmount, 18);
				const weiAmountStr: string = weiAmount.toString();

				if (optRound === true) {
					return roundNumber({
						r_amount: weiAmountStr,
						r_maxDecimalDigits: decimalPoint,
						r_opt: "up",
						localeString,
						decimalPoints,
					});
				}
				if (optRound === false) {
					return roundNumber({
						r_amount: weiAmountStr,
						r_maxDecimalDigits: decimalPoint,
						r_opt: "down",
						localeString,
						decimalPoints,
					});
				}
				return roundNumber({
					r_amount: weiAmountStr,
					r_maxDecimalDigits: decimalPoint,
					r_opt: "down",
					localeString,
					decimalPoints,
				});
			case "ray":
				const rayAmount = utils.formatUnits(numAmount, 27);
				const rayAmountStr: string = rayAmount.toString();
				if (optRound === true) {
					return roundNumber({
						r_amount: rayAmountStr,
						r_maxDecimalDigits: decimalPoint,
						r_opt: "up",
						localeString,
						decimalPoints,
					});
				}
				return roundNumber({
					r_amount: rayAmountStr,
					r_maxDecimalDigits: decimalPoint,
					r_opt: "down",
					localeString,
					decimalPoints,
				});
			default:
				throw new Error(`this type is not valid. It must be 'WTON' or 'TON'`);
		}
	} catch (e) {
		// console.log(e);
	}
}

export function convertLargeNumber(num: string | undefined) {
	let floatParse = num ? floatParser(num) : 0;
	let convertedNumber;

	if (floatParse) {
		if (floatParse / 10e15 >= 1) {
			convertedNumber = floatParse / 10e15;
			convertedNumber = checkNumberLength(convertedNumber);
			convertedNumber = convertedNumber + "Qn";
		} else if (floatParse / 10e12 >= 1) {
			convertedNumber = floatParse / 10e12;
			convertedNumber = checkNumberLength(convertedNumber);
			convertedNumber = convertedNumber + "Qd";
		} else if (floatParse / 10e9 >= 1) {
			convertedNumber = floatParse / 10e9;
			convertedNumber = checkNumberLength(convertedNumber);
			convertedNumber = convertedNumber + "B";
		} else if (floatParse / 10e6 >= 1) {
			convertedNumber = floatParse / 10e6;
			convertedNumber = checkNumberLength(convertedNumber);
			convertedNumber = convertedNumber + "M";
		} else {
			convertedNumber = num;
		}
	} else {
		convertedNumber = num;
	}

	return convertedNumber;
}

function checkNumberLength(num: number) {
	let returnValue;
	return (returnValue =
		num >= 100
			? num.toLocaleString(undefined, { maximumFractionDigits: 0 })
			: num >= 10 && num < 100
				? num.toLocaleString(undefined, {
						maximumFractionDigits: 1,
						minimumFractionDigits: 1,
					})
				: num.toLocaleString(undefined, {
						maximumFractionDigits: 2,
						minimumFractionDigits: 2,
					}));
}

export function calcCountDown(sec: string) {
	if (sec === "0") return "(00 days 00 hours left)";

	const numSec = Number(sec);
	const days = Math.floor(numSec / (60 * 60 * 24));
	const hours = Math.floor((numSec % (60 * 60 * 24)) / (60 * 60));

	return `(${days < 10 ? `0${days}` : days} days ${hours < 10 ? `0${hours}` : hours} hours left)`;
}

export function calcCountDown2(sec: string) {
	if (sec === "0") return "(00 days 00 hours left)";

	const numSec = Number(sec);
	const days = Math.floor(numSec / (60 * 60 * 24));
	const hours = Math.floor((numSec % (60 * 60 * 24)) / (60 * 60));

	return `${days < 10 ? `0${days}` : days} days ${hours < 10 ? `0${hours}` : hours} hours left`;
}
