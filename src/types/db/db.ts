import {BlogModel} from "../blogs/output";
import {PostModel} from "../posts/output";

export type DBType = {
    blogs: BlogModel[],
    posts: PostModel[]
}

export type BlogDbType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type PostDbType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}