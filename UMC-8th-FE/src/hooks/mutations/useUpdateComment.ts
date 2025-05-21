import { useMutation } from "@tanstack/react-query";
import { updateComment } from "../../apis/comments";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

const useUpdateComment = () => {
  return useMutation({
    mutationFn: updateComment,
    onSuccess: (_, variables) => {
      console.log('댓글 수정 성공');
      // 모든 정렬 순서에 대해 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.comments, variables.lpid],
      });
    },
  });
};

export default useUpdateComment;
