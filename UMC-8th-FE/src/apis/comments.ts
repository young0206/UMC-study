import { ResponseCommentsListDto } from "../types/comments";
import { PaginationDto } from "../types/common";
import { axiosInstance } from "./axios";

export const getCommentsList = async (PaginationDto: PaginationDto): Promise<ResponseCommentsListDto> => {
    const{data} = await axiosInstance.get('/v1/lps', {
        params: PaginationDto,
    });

    return data;
};