import { CommonResponse, CursorBaseResponse } from "./common";

export type Tags = {
  id: number;
  name: string;
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
};

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  tags: Tags[];
  likes: Likes[];
};

export type RequestLpDto = {
  lpid?: number;
  title?: string;
  content?: string;
  tags?: string[];
  file?: File;
  thumbnail?: string;
  published?: boolean;
};

export type ResponseLpDto = CommonResponse<Lp>;

export type ResponseLpListDto = CursorBaseResponse<Lp[]>;

export type ResponseLikeLpDto = CommonResponse<{
  id: number;
  userId: number;
  lpId: number;
}>;

