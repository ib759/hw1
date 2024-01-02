import {PostModel} from "./output";

export type QueryPostOutputModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostModel[]
}