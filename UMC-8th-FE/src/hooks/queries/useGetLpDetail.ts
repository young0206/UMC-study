import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { RequestLpDto } from "../../types/lp";
import { getLpDetail } from "../../apis/lp";

function useGetLpDetail({ lpid }: RequestLpDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, lpid],
    queryFn: () => getLpDetail({ lpid }),
  });
}

export default useGetLpDetail;
