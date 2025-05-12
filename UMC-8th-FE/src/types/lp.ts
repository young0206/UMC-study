import { CursorBaseResponse } from "./common";

export type Tag = {
    id: number;
    name: string;
}

export type Likes = {
    id: number;
    userid: number;
    lpid: number;
}

export type Lp = {
    id: number;
        title: string;
        content: string;
        thumbnail: string;
        published: boolean;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        tags: Tag[];
        likes: Likes[];
};

export type ResponseLpListDto = CursorBaseResponse<Lp[]>;