
export type QueryUserInputModel = {
    sortBy?: string
    sortDirection?: 'desc' | 'asc'
    pageNumber?: number
    pageSize?: number
    searchLoginTerm?: string
    searchEmailTerm?: string
}