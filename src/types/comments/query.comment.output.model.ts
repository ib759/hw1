import {CommentModel} from "./output.comments.model";

export type QueryCommentOutputModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentModel[]
}