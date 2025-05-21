import { useMutation } from "@tanstack/react-query";
import { updateComment } from "../../apis/comments";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

const useUpdateComment = () => {
  return useMutation({
    mutationFn: updateComment,
    onSuccess: (data) => {
      console.log('응답 확인:', data);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.comments, data.data.lpId],
        exact: true,
      });
    },
  });
};

export default useUpdateComment;
