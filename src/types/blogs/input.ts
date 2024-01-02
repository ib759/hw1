export type CreateBlogModel = {
    name: string
    description: string
    websiteUrl: string
}

export type UpdateBlogModel = {
    name: string
    description: string
    websiteUrl: string
}

export type CreatePostByBlog = {
    title: string,
    shortDescription: string,
    content: string
}