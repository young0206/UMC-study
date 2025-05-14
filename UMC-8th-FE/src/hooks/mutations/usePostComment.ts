import { useMutation } from "@tanstack/react-query";
import { addComment } from "../../apis/comments";

const usePostComment = () => {
  return useMutation({
    mutationFn: addComment,
  });
};

export default usePostComment;
