import { useQuery } from "@tanstack/react-query";
import { getAllCountryNames } from "../../utils/helpers";

export function useCountriesName() {
	const {
		data: countriesName,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["countriesName"],
		queryFn: () => getAllCountryNames(),
		retry: false,
	});
	return { countriesName, isLoading, error };
}
