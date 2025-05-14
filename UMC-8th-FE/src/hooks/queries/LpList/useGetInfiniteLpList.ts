import { useInfiniteQuery } from "@tanstack/react-query";
import { PAGINATION_ORDER } from "../../../enums/common";
import { QUERY_KEY } from "../../../constants/key";
import { getLpList } from "../../../apis/lp";

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: PAGINATION_ORDER = PAGINATION_ORDER.desc // 기본값으로 PAGINATION_ORDER.desc 설정
) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, { search, order }],
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
