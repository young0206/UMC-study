// src/apis/comments.ts

import { ResponseCommentsListDto } from "../types/comments";
import { PaginationDto } from "../types/common";
import { axiosInstance } from "./axios";

// 댓글 목록을 가져오는 함수
export const getComments = async ({
  lpid,
}: {
  lpid: number;
}): Promise<ResponseCommentsListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}/comments`);
  return data;
};

export const addComment = async ({
  content,
  lpid,
}: {
  content: string;
  lpid: number;
}): Promise<ResponseCommentsListDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpid}/comments`, { content });
  return data;
};

// 댓글 삭제 API
export const deleteComment = async ({
  commentId,
  lpid,
}: {
  commentId: number;
  lpid: number;
}): Promise<ResponseCommentsListDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpid}/comments/${commentId}`);
  return data;
};

// 댓글 수정 API
export const updateComment = async ({
  commentId,
  content,
  lpid,
}: {
  commentId: number;
  content: string;
  lpid: number;
}): Promise<ResponseCommentsListDto> => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpid}/comments/${commentId}`,
    { content }
  );
  return data;
};
