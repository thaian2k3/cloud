import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/apiSettings";

// Tao custom hook de lay du lieu bang Setting tu supabase
export function useSettings() {
	const {
		isLoading,
		error,
		data: settings,
	} = useQuery({
		queryKey: ["settings"],
		queryFn: getSettings,
	});
	return { isLoading, error, settings };
}
