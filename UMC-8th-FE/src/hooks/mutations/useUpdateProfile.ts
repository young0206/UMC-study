import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";

interface UpdateProfileResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

type UpdateProfilePayload = {
  name: string;
  bio: string;
  profileImage: File | null;
};

const updateUserProfile = async (data: {
  name: string;
  bio: string;
  profileImage: File | null;
}): Promise<UpdateProfileResponse> => {
  try {
    let requestData;
    const headers: Record<string, string> = {};
    let formDataInstance: FormData | null = null;

    if (data.profileImage) {
      // 이미지가 있을 경우 FormData 사용
      formDataInstance = new FormData();
      formDataInstance.append("name", data.name.trim());
      formDataInstance.append("bio", data.bio.trim());
      formDataInstance.append("profileImage", data.profileImage);
      requestData = formDataInstance;
      headers["Content-Type"] = "multipart/form-data";
    } else {
      // 이미지가 없을 경우 JSON으로 전송
      requestData = {
        name: data.name.trim(),
        bio: data.bio.trim()
      };
      headers["Content-Type"] = "application/json";
    }

    // 전송할 데이터 로깅
    console.log("전송할 데이터:", {
      type: data.profileImage ? "FormData" : "JSON",
      content: data.profileImage && formDataInstance ? {
        name: formDataInstance.get("name"),
        bio: formDataInstance.get("bio"),
        profileImage: "File present"
      } : requestData
    });

    const response = await axiosInstance.patch<UpdateProfileResponse>(
      "/v1/users",
      requestData,
      { headers }
    );

    // 응답 데이터 상세 로깅
    console.log("서버 응답 상세 데이터:", {
      status: response.data.status,
      message: response.data.message,
      statusCode: response.data.statusCode,
      responseData: response.data.data
    });

    return response.data;
  } catch (error) {
    console.error("프로필 업데이트 중 오류 발생:", error);
    throw error;
  }
};

const useUpdateProfile = () => {
  const mutation = useMutation<UpdateProfileResponse, Error, UpdateProfilePayload>({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      console.log("프로필 업데이트 성공:", data);
    },
    onError: (error) => {
      console.error("프로필 업데이트 실패:", error);
    }
  });

  return {
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending
  };
};

export default useUpdateProfile;
