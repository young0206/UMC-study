import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { RequestLpDto } from "../../types/lp";
import { getLpDetail } from "../../apis/lp";

function useGetLpDetail({ lpid, queryKey = QUERY_KEY.lpDetail }: RequestLpDto & { queryKey?: string }) {
  return useQuery({
    queryKey: [queryKey, lpid],
    queryFn: () => getLpDetail({ lpid }),
  });
}

export default useGetLpDetail;
