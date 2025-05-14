import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// 계정 삭제 API 호출 함수
const deleteAccountApi = async (): Promise<void> => {
  try {
    await axios.delete("http://localhost:8000/v1/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error: unknown) {
    console.error("계정 삭제 실패:", error);
    throw new Error("계정 삭제 실패");
  }
};

const useDeleteAccount = () => {
  // useMutation의 반환 타입을 맞추고, mutateAsync 사용
  return useMutation<void, unknown, void>({
    mutationFn: deleteAccountApi, // 비동기 함수 지정
    onSuccess: () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("계정 삭제 오류 발생:", error.message);
      } else {
        console.error("계정 삭제 오류 발생:", error);
      }
    },
  });
};

export default useDeleteAccount;
