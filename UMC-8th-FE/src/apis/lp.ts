import { PaginationDto } from "../types/common";
import { RequestLpDto, ResponseLikeLpDto, ResponseLpDto, ResponseLpListDto } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (
  PaginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: PaginationDto,
  });

  return data;
};

export const getLpDetail = async ({
  lpid,
}: RequestLpDto): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);

  return data;
};

export const postLike = async ({
  lpid,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpid}/likes`);

  return data;
};

export const deleteLike = async ({
  lpid,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpid}/likes`);

  return data;
};

export const postLp = async ({
  title,
  content,
  tags,
  file,
}: RequestLpDto): Promise<ResponseLpDto> => {
  const formData = new FormData();

  // 빈 값이 들어갈 경우 기본값을 설정
  formData.append("title", title || "");
  formData.append("content", content || "");
  formData.append("tags", JSON.stringify(tags || [])); // tags가 없으면 빈 배열로 설정

  // 파일이 있을 경우만 formData에 추가
  if (file) {
    formData.append("file", file);
  }

  try {
    const { data } = await axiosInstance.post("/v1/lps", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("LP 추가 성공:", data);  // 성공 로그 확인
    return data;
  } catch (error) {
    console.error("LP 추가 실패:", error);  // 오류 로그 확인
    throw error;
  }
};
