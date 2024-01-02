import {BlogModel} from "./output";
import {PostModel} from "../posts/output";

export type QueryBlogOutputModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogModel[]
}

export type QueryPostByBlogIdOutputModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostModel[]
}