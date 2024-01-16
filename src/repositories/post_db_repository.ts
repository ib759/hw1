import {blogCollection, commentCollection, postCollection} from "../../db/db";
import {PostModel} from "../types/posts/output";
import {postMapper} from "../types/posts/mappers/post-mapper";
import {ObjectId} from "mongodb";
import {CreatePostModel, UpdatePostModel} from "../types/posts/input";
import {PostDbType} from "../types/db/db";
import {QueryPostInputModel} from "../types/posts/query.post.input.models";
import {QueryPostOutputModel} from "../types/posts/query.post.output.models";
import {CreateCommentModel} from "../types/comments/input.comments.model";
import {CommentModel} from "../types/comments/output.comments.model";
import {CommentRepository} from "./comment_db_repository";
import {commentMapper} from "../types/comments/mappers/comment-mapper";
import {QueryCommentInputModel} from "../types/comments/query.comment.input.model";
import {QueryCommentOutputModel} from "../types/comments/query.comment.output.model";
import {UserModel} from "../types/users/output.users.model";

export class PostRepository {

    static async getAllPosts(sortData: QueryPostInputModel): Promise<QueryPostOutputModel>{
        //const posts = await postCollection.find({}).toArray()

        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc' //if 'desc' ?? sortData.sortDirection, then .sort(sortBy, sortDirection -highlighted RED)
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10
//debugger
        const posts = await postCollection
            .find({})
            .sort(sortBy, sortDirection)
            .skip((pageNumber-1)*pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await postCollection.countDocuments()
        const pagesCount = Math.ceil(totalCount/pageSize)
        return {
            pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount,
            items: posts.map(postMapper)
        }

    }

    static async getPostById(id:string): Promise<PostModel | null>{
        const post = await postCollection.findOne({_id: new ObjectId(id)})
        if(!post){
            return null
        }
        return postMapper(post)
    }

    static async createPost(createdPost: CreatePostModel): Promise<PostModel|undefined>{
        const createdAt = new Date()

        const blog = await blogCollection.findOne({_id: new ObjectId(createdPost.blogId)})
        if(!blog){
            return
        }
        const newPost: PostDbType = {
            ...createdPost,
            blogName: blog.name,
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

    static async createCommentByPost(postId:string, user: UserModel, createData: CreateCommentModel): Promise<CommentModel | null>{

        const createdAt = new Date()

        const newComment = {
            content: createData.content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            createdAt: createdAt.toISOString(),
            postId: postId
        }

        const comment = await commentCollection.insertOne(newComment)

        return{
            ...newComment,
            id: comment.insertedId.toString()
        }
    }

    static async getCommentsByPostId(postId: string, sortData: QueryCommentInputModel): Promise<QueryCommentOutputModel>{

        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'

        const comments = await commentCollection
            .find({postId: postId})
            .sort(sortBy, sortDirection)
            .skip((pageNumber-1)*pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await commentCollection.countDocuments({postId: postId})
        const pagesCount = Math.ceil(totalCount/pageSize)

        return{
            pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount,
            items: comments.map(commentMapper)
        }
    }
}