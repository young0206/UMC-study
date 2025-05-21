import { useMutation } from "@tanstack/react-query";
import { deleteLp } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useDeleteLp() {
  return useMutation({
    mutationFn: deleteLp,
    onSuccess: (data) => {
        console.log('응답 확인:', data);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.lpId],
        exact: true,
      });
    },
  });
}

export default useDeleteLp;