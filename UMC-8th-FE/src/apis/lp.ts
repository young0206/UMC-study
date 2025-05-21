import { PaginationDto } from "../types/common";
import { RequestLpDto, ResponseLikeLpDto, ResponseLpDto, ResponseLpListDto } from "../types/lp";
import { axiosInstance } from "./axios";
import { AxiosError } from "axios";

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

export const deleteLp = async ({
  lpid,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpid}`);

  return data;
};

export const posteLp = async (): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`/v1/lps`);

  return data;
};

export const deleteAccount = async (
): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/users`);

  return data;
};

export const updateLp = async ({
  lpid,
  title,
  content,
  tags,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  try {
    console.log("수정할 데이터:", {
      title,
      content,
      tags,
    });

    const { data } = await axiosInstance.patch(`/v1/lps/${lpid}`, {
      title,
      content,
      tags,
    });

    console.log("LP 수정 성공:", data);
    return data;
  } catch (error) {
    console.error("LP 수정 실패:", error);
    throw error;
  }
};

export const postLp = async ({
  title,
  content,
  tags,
  thumbnail,
  published,
}: RequestLpDto): Promise<ResponseLpDto> => {
  try {
    console.log("전송할 데이터:", {
      title,
      content,
      tags,
      thumbnail,
      published
    });

    const { data } = await axiosInstance.post("/v1/lps", {
      title,
      content,
      tags,
      thumbnail,
      published
    });

    console.log("LP 추가 성공:", data);
    return data;
  } catch (error) {
    console.error("LP 추가 실패:", error);
    throw error;
  }
};
