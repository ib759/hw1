import {blogCollection, BlogModelMongoose, postCollection, PostModelMongoose} from "../../db/db";
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
        const sortBy =  sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc' //if 'desc' ?? sortData.sortDirection, then .sort(sortBy, sortDirection -highlighted RED)
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        let filter = {}

        if(searchNameTerm){
            filter = {
                name: {$regex: searchNameTerm, $options:'i'}
            }
        }

        /*const blogs = await blogCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber-1)*pageSize)
            .limit(+pageSize)
            .toArray()*/

        const blogsM = await BlogModelMongoose
            .find(filter)
            .sort({sortBy: sortDirection})
            .skip((pageNumber-1)*pageSize)
            .limit(+pageSize)
            .lean()
//debugger
        //const blogsEdit = blogs.map(blogMapper)
        const blogsEdit = blogsM.map(blogMapper)
        //const totalCount = await blogCollection.countDocuments(filter)
        const totalCount = await BlogModelMongoose.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount/pageSize)

        return {
            pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount,
            items: blogsEdit
        }

    }

    static async getPostsByBlogId(blogId:string, sortData: QueryPostByBlogIdInputModel): Promise<QueryPostByBlogIdOutputModel> { //:Promise<BlogModel[]>
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc' //if 'desc' ?? sortData.sortDirection, then .sort(sortBy, sortDirection -highlighted RED)
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        const posts = await PostModelMongoose
            .find({blogId: blogId})
            .sort({sortBy: sortDirection})
            .skip((pageNumber-1)*pageSize)
            .limit(+pageSize)
            .lean()

        const totalCount = await PostModelMongoose.countDocuments({blogId: blogId})
        const pagesCount = Math.ceil(totalCount/pageSize)
        return {
            pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount,
            items: posts.map(postMapper)
        }

    }

    static async getBlogById(id:string): Promise<BlogModel | null>{
        //const blog = await blogCollection.findOne({_id: new ObjectId(id)})
        const blog = await BlogModelMongoose.findOne({_id: new ObjectId(id)})
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
        //const blog = await blogCollection.insertOne(newBlog)
        const blog = await BlogModelMongoose.insertMany([newBlog])

        //const blogidtest = blog[0]._id.toString()

        return {
            ...newBlog,
            //id: blog.insertedId.toString()
            id: blog[0]._id.toString()
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
            //const isInserted = await postCollection.insertOne(post)
            const isInserted = await PostModelMongoose.insertMany([post])

            return isInserted[0]._id.toString()
        }
        return null
    }

    static async updateBlogById(id:string, updatedData: UpdateBlogModel): Promise<boolean> {

        /*const blog = await blogCollection.updateOne({_id: new ObjectId(id)}, {$set: {
            name: updatedData.name,
            description: updatedData.description,
                websiteUrl: updatedData.websiteUrl
        }})*/
        const blog = await BlogModelMongoose.updateOne({_id: new ObjectId(id)}, {$set: {
                name: updatedData.name,
                description: updatedData.description,
                websiteUrl: updatedData.websiteUrl
            }})
        //return !!blog.matchedCount;

        return !!blog.modifiedCount;
    }

    static async deleteBlogById(id:string): Promise<boolean> {
        //const blog = await blogCollection.deleteOne({_id: new ObjectId(id)})
        const blog = await BlogModelMongoose.deleteOne({_id: new ObjectId(id)})
        return !!blog.deletedCount;
    }
}