import { useQuery } from "@tanstack/react-query";
import { getStaysTodayActivity } from "../../services/apiBookings";

export function useToDayActivity() {
	const { isLoading, data: activities } = useQuery({
		queryFn: getStaysTodayActivity,
		queryKey: ["today-activity"],
	});
	return { activities, isLoading };
}
