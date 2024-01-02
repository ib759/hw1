import {blogCollection, postCollection} from "../../db/db";
import {BlogModel} from "../types/blogs/output";
import {blogMapper} from "../types/blogs/mappers/blog-mapper";
import {ObjectId, WithId} from "mongodb";
import {CreateBlogModel, CreatePostByBlog, UpdateBlogModel} from "../types/blogs/input";
import {BlogDbType} from "../types/db/db";
import {QueryBlogInputModel, QueryPostByBlogIdInputModel} from "../types/blogs/query.blog.input.models";
import {postMapper} from "../types/posts/mappers/post-mapper";
import {QueryBlogOutputModel, QueryPostByBlogIdOutputModel} from "../types/blogs/query.blog.output.models";

export class BlogRepository {
    static async getAllBlogs(sortData: QueryBlogInputModel) :Promise<QueryBlogOutputModel> { //:Promise<BlogModel[]>
        const searchNameTerm = sortData.searchNameTerm ?? null
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = 'desc' ?? sortData.sortDirection //if 'desc' ?? sortData.sortDirection, then .sort(sortBy, sortDirection -highlighted RED)
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        let filter = {}

        if(searchNameTerm){
            filter = {
                name: {$regex: searchNameTerm, $options:'i'}
            }
        }

        const blogs = await blogCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await blogCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount/pageSize)
        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: blogs.map(blogMapper)
        }

    }

    static async getPostsByBlogId(blogId:string, sortData: QueryPostByBlogIdInputModel): Promise<QueryPostByBlogIdOutputModel> { //:Promise<BlogModel[]>
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = 'desc' ?? sortData.sortDirection //if 'desc' ?? sortData.sortDirection, then .sort(sortBy, sortDirection -highlighted RED)
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        const posts = await postCollection
            .find({blogId: blogId})
            .sort(sortBy, sortDirection)
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await postCollection.countDocuments({blogId: blogId})
        const pagesCount = Math.ceil(totalCount/pageSize)
        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(postMapper)
        }

    }

    static async getBlogById(id:string): Promise<BlogModel | null>{
        const blog = await blogCollection.findOne({_id: new ObjectId(id)})
        if(!blog){
            return null
        }
        return blogMapper(blog)
    }

    static async createBlog(createdData: CreateBlogModel): Promise<BlogModel> {
        const createdAt = new Date()
        const newBlog: BlogDbType = {
            ...createdData,
            createdAt: createdAt.toISOString(),
            isMembership: false
        }
        const blog = await blogCollection.insertOne(newBlog)

        return {
            ...newBlog,
            id: blog.insertedId.toString()
        }
    }

    static async createPostToBlog(blogId: string, postData:CreatePostByBlog): Promise<string | null> {//: Promise<string | undefined>{ errors with types
        const createdAt = new Date()

        const blog = await this.getBlogById(blogId)
        if (blog) {
            const post = {
                title: postData.title,
                shortDescription: postData.shortDescription,
                content: postData.content,
                blogId: blogId,
                blogName: blog.name,
                createdAt: createdAt.toISOString()
            }
            const res = await postCollection.insertOne(post)

            return res.insertedId.toString()
        }
        return null
    }

    static async updateBlogById(id:string, updatedData: UpdateBlogModel): Promise<boolean> {

        const blog = await blogCollection.updateOne({_id: new ObjectId(id)}, {$set: {
            name: updatedData.name,
            description: updatedData.description,
                websiteUrl: updatedData.websiteUrl
        }})
        return !!blog.matchedCount;
    }

    static async deleteBlogById(id:string): Promise<boolean> {
        const blog = await blogCollection.deleteOne({_id: new ObjectId(id)})
        return !!blog.deletedCount;
    }
}