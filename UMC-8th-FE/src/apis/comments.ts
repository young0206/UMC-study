// src/apis/comments.ts

import { ResponseCommentsListDto } from "../types/comments";
import { PaginationDto } from "../types/common";
import { axiosInstance } from "./axios";

// 댓글 목록을 가져오는 함수
export const getCommentsList = async ({
  lpid,
  ...PaginationDto
}: { lpid: number } & PaginationDto): Promise<ResponseCommentsListDto> => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const { data } = await axiosInstance.get(`/v1/lps/${lpid}/comments`, {
    params: PaginationDto,
    headers: {
      Authorization: `Bearer ${token.replace(/"/g, "")}`, // Authorization 헤더 추가
    },
  });

  return data;
};

export const addComment = async ({
  content,
  lpid,
}: {
  content: string;
  lpid: number;
}): Promise<Comment> => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const { data } = await axiosInstance.post(
    `/v1/lps/${lpid}/comments`, // 댓글 추가 API 경로
    { content },
    {
      headers: {
        Authorization: `Bearer ${token.replace(/"/g, "")}`, // Authorization 헤더 추가
      },
    }
  );

  return data;
};

// 댓글 삭제 API
export const deleteComment = async ({
  commentId,
  lpid,
}: {
  commentId: number;
  lpid: number;
}): Promise<void> => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No access token");

  await axiosInstance.delete(`/v1/lps/${lpid}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token.replace(/"/g, "")}`,
    },
  });
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
}): Promise<void> => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No access token");

  await axiosInstance.patch(
    `/v1/lps/${lpid}/comments/${commentId}`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token.replace(/"/g, "")}`,
      },
    }
  );
};
