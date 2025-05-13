import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { PAGINATION_ORDER } from "../../enums/common";

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order = PAGINATION_ORDER
) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, { search, order }], // ✅ 문자열 기반 key
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getLpList({
        cursor: pageParam,
        limit,
        search,
        order,
      });
      return response;
    },

    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      console.log("lastPage: ", lastPage);
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
  });
}

export default useGetInfiniteLpList;