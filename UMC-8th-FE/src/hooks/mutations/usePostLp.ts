import { useMutation } from "@tanstack/react-query";
import { postLp } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import { RequestLpDto } from "../../types/lp";

function usePostLp() {
  return useMutation({
    mutationFn: (data: RequestLpDto) => postLp(data),
    onSuccess: (data) => {
      console.log('응답 확인:', data);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
    },
  });
}

export default usePostLp;