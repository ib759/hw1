import {blogCollection} from "../../db/db";
import {BlogModel} from "../types/blogs/output";
import {blogMapper} from "../types/blogs/mappers/blog-mapper";
import {ObjectId, WithId} from "mongodb";
import {CreateBlogModel, UpdateBlogModel} from "../types/blogs/input";
import {BlogDbType} from "../types/db/db";

export class BlogRepository {
    static async getAllBlogs(): Promise<BlogModel[]>{
        const blogs = await blogCollection.find({}).toArray()
        return blogs.map(blogMapper)
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