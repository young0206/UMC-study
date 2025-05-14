import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const deleteLpApi = async (lpId: number) => {
  const response = await axios.delete(`http://localhost:8000/v1/lps/${lpId}`);
  return response.data;
};

const useDeleteLp = () => {
  return useMutation({
    mutationFn: deleteLpApi,
    onSuccess: () => {
      console.log("LP 삭제 성공");
    },
    onError: (error) => {
      console.error("LP 삭제 실패:", error);
    },
  });
};

export default useDeleteLp;
