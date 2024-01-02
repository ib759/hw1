
export type QueryBlogInputModel = {
    searchNameTerm?: string
    sortBy?: string
    sortDirection?: string
    pageNumber?: number
    pageSize?: number
}

export type QueryPostByBlogIdInputModel = {
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortDirection?: string
}