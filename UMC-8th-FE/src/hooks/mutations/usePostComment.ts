import { useMutation } from "@tanstack/react-query";
import { addComment } from "../../apis/comments";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

const usePostComment = () => {
  return useMutation({
    mutationFn: addComment,
    onSuccess: (data, variables) => {
      console.log('응답 확인:', data);
      // 모든 정렬 순서에 대해 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.comments, variables.lpid],
      });
    },
  });
};

export default usePostComment;
