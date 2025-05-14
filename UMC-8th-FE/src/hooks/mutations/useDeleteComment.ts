import { useMutation } from "@tanstack/react-query";
import { deleteComment } from "../../apis/comments";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useDeleteComment() {
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.comments] as const,
      });
    },
  });
}

export default useDeleteComment;
