import { useMutation } from "@tanstack/react-query";
import { updateComment } from "../../apis/comments";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useUpdateComment() {
  return useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.comments] as const,
      });
    },
  });
}

export default useUpdateComment;
