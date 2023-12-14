import { formatDistance, parseISO } from "date-fns";
import { differenceInDays } from "date-fns/esm";
import axios from "axios";

export const subtractDates = (dateStr1, dateStr2) =>
	differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
	formatDistance(parseISO(dateStr), new Date(), {
		addSuffix: true,
	})
		.replace("about ", "")
		.replace("in", "In");

export const getToday = function (options = {}) {
	const today = new Date();

	if (options?.end) today.setUTCHours(23, 59, 59, 999);
	else today.setUTCHours(0, 0, 0, 0);
	return today.toISOString();
};

export const formatCurrency = (value) =>
	new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(value);

export const getCountryCode = async (countryName) => {
	console.log(countryName);
	try {
		const response = await axios.get(
			`https://restcountries.com/v3.1/name/${countryName}`
		);
		const countryData = response.data[0];
		console.log(countryData);
		return countryData.cca2.toLowerCase();
	} catch (error) {
		console.error("Error fetching country code: ", error);
	}
};

export const getAllCountryNames = async () => {
	try {
		const response = await axios.get("https://restcountries.com/v3.1/all");
		const countryNames = response.data.map(
			(country) => country.name.common
		);
		return countryNames;
	} catch (error) {
		console.error("Error fetching country names: ", error);
	}
};
