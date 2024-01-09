import {UserModel} from "./output.users.model";

export type QueryUserOutputModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserModel[]
}