import { useMutation } from "@tanstack/react-query";
import { updateLp } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useUpdateLp() {
  return useMutation({
    mutationFn: updateLp,
    onSuccess: (data) => {
      console.log('응답 확인:', data);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpDetail, data.data.id],
        exact: true,
      });
    },
  });
}

export default useUpdateLp;