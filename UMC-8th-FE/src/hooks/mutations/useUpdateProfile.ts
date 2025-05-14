import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UpdateProfileResponse {
  success: boolean;
  message: string;
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
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("로그인이 필요합니다. 다시 로그인해주세요.");
    throw new Error("Access token이 없습니다.");
  }

  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("bio", data.bio);
  if (data.profileImage) {
    formData.append("profileImage", data.profileImage);
  }

const response = await axios.patch<UpdateProfileResponse>(
  "http://localhost:8000/v1/users",
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`, // 공백이 포함된 따옴표 없이 올바르게 설정
      "Content-Type": "multipart/form-data",
    },
  }
);


  return response.data;
};

const useUpdateProfile = () => {
  return useMutation<UpdateProfileResponse, Error, UpdateProfilePayload>({
    mutationFn: updateUserProfile,
  });
};

export default useUpdateProfile;
