
export type QueryBlogInputModel = {
    searchNameTerm?: string
    sortBy?: string
    sortDirection?: 'desc' | 'asc'
    pageNumber?: number
    pageSize?: number
}

export type QueryPostByBlogIdInputModel = {
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortDirection?: 'desc' | 'asc'
}