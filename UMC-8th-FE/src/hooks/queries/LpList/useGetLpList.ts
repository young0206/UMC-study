import { useQuery } from "@tanstack/react-query";
import { PaginationDto } from "../../../types/common";
import { QUERY_KEY } from "../../../constants/key";
import { getLpList } from "../../../apis/lp";



function useGetLpList({cursor, search, order, limit}:PaginationDto) {
    return useQuery({
        queryKey:[QUERY_KEY.lps, search, order],
        queryFn: () => getLpList({
            cursor, search, order, limit,
        }),
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 10, // 10분

        select: (data) => data.data.data,
    });
}

export default useGetLpList;