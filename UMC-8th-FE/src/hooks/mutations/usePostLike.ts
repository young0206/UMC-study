import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import { Likes, ResponseLpDto } from "../../types/lp";
import { ResponseMyInfoDto } from "../../types/auth";

function usePostLike() {
  return useMutation({
    mutationFn: postLike,
    onMutate: async (lp) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, lp.lpid],
      });

      const previousLpPost = queryClient.getQueryData<ResponseLpDto>([
        QUERY_KEY.lps,
        lp.lpid,
      ]);

      const newLpPost = { ...previousLpPost };

      const me = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);
      const userId = Number(me?.data.id);

      const likedIndex =
        previousLpPost?.data.likes.findIndex(
          (like) => like.userId === userId
        ) ?? -1;

      if (likedIndex > 0) {
        previousLpPost?.data.likes.splice(likedIndex, 1);
      } else {
        const newLike = { userId, lpId: lp.lpid } as Likes;
        previousLpPost?.data.likes.push(newLike);
      }
      queryClient.setQueryData([QUERY_KEY.lps, lp.lpid], newLpPost);

      return { previousLpPost, newLpPost };
    },
  });
}

export default usePostLike;
