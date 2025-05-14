import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const updateLpApi = async (lpId: number, title: string, content: string) => {
  const response = await axios.put(`http://localhost:8000/v1/lps/${lpId}`, {
    title,
    content,
  });
  return response.data;
};

const useUpdateLp = () => {
  return useMutation({
    mutationFn: updateLpApi,
    onSuccess: () => {
      console.log("LP 수정 성공");
    },
    onError: (error) => {
      console.error("LP 수정 실패:", error);
    },
  });
};

export default useUpdateLp;
