// src/hooks/mutations/usePostLp.ts
import { useMutation } from "@tanstack/react-query";
import { postLp } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function usePostLp() {
  return useMutation({
    mutationFn: postLp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
    },
  });
}

export default usePostLp;
