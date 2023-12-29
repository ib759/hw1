import {postCollection} from "../../db/db";
import {PostModel} from "../types/posts/output";
import {postMapper} from "../types/posts/mappers/post-mapper";
import {ObjectId} from "mongodb";
import {CreatePostModel, UpdatePostModel} from "../types/posts/input";
import {PostDbType} from "../types/db/db";

export class PostRepository {

    static async getAllPosts(): Promise<PostModel[]>{
        const posts = await postCollection.find({}).toArray()
        return posts.map(postMapper)
    }

    static async getPostById(id:string): Promise<PostModel | null>{
        const post = await postCollection.findOne({_id: new ObjectId(id)})
        if(!post){
            return null
        }
        return postMapper(post)
    }

    static async createPost(createdPost: CreatePostModel): Promise<PostModel>{
        const createdAt = new Date()
        const newPost: PostDbType = {
            ...createdPost,
            blogName: "string",
            createdAt: createdAt.toISOString()
        }

        const post = await postCollection.insertOne(newPost)

        return {
            ...newPost,
            id: post.insertedId.toString()
        }
    }

    static async updatePostById(id:string, updatedPost: UpdatePostModel): Promise<boolean>{
        const post = await postCollection.updateOne({_id: new ObjectId(id)}, {$set: {
                title: updatedPost.title,
                shortDescription: updatedPost.shortDescription,
                content: updatedPost.content,
                blogId: updatedPost.blogId
            }})
        return !!post.matchedCount;
    }

    static async deletePostById(id:string): Promise<boolean>{
        const post = await postCollection.deleteOne({_id: new ObjectId(id)})
        return !!post.deletedCount;
    }
}