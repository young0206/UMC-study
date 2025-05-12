import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { PAGINATION_ORDER } from "../../enums/common";

function useGetInfiniteLpList(
    limit:number, 
    search:string, 
    order:PAGINATION_ORDER
) {
    return useInfiniteQuery({
        queryFn:({pageParam}) => 
            getLpList({cursor: pageParam, limit, search, order}),
        queryKey:[QUERY_KEY.lps, search, order],
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            console.log(lastPage, allPages);
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        },
    });
}

export default useGetInfiniteLpList;