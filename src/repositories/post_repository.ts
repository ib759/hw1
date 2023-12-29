import {db} from "../../db/db";
import {PostModel} from "../types/posts/output";

export class PostRepository {
    static getAllPosts(){
        return db.posts
    }

    static getPostById(id:string){
        return db.posts.find(p => p.id === id)
    }

    static createPost(title:string, shortDescription:string, content:string, blogId:string){
        let newId = +(new Date())
        const createdAt = new Date()
        const newPost: PostModel = {
            id: newId.toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: new Date().toString(),
            createdAt: createdAt.toISOString()
        }

        db.posts.push(newPost)
        return newPost
    }

    static updatePostById(id:string, title:string, shortDescription:string, content:string, blogId:string){
        let updatedPost = db.posts.find(p => p.id === id)
        if (updatedPost){
            updatedPost.title = title
            updatedPost.shortDescription = shortDescription
            updatedPost.content = content
            updatedPost.blogId = blogId
            return true;
        } else {
            return false;
        }
    }

    static deletePostById(id:string){
        for (let i=0; i < db.posts.length; i++) {
            if (db.posts[i].id === id) {
                db.posts.splice(i,1);
                return true;
            }
        }
        return false;
    }
}