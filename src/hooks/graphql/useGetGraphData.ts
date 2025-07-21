import { GET_GRAPH, GET_FACTORY } from "@/graphql/query/getGraphdata";
import { useQuery } from "@apollo/client";
import ms from "ms";
import { useMemo } from "react";

export function useGetGraphData() {
	const { data, loading, error } = useQuery(GET_GRAPH, {
		pollInterval: ms(`10s`),
	});

	return useMemo(
		() => ({
			error,
			loading,
			stakingDayDatas: data?.stakingDayDatas,
		}),
		[data, error, loading],
	);
}

export function useGetFactory() {
	const { data, loading, error } = useQuery(GET_FACTORY, {
		pollInterval: ms(`10s`),
	});

	return useMemo(
		() => ({
			error,
			loading,
			factories: data?.factories[0].totalStaked,
		}),
		[data, error, loading],
	);
}
