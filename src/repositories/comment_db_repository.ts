import {CommentModel} from "../types/comments/output.comments.model";
import {commentCollection, CommentModelMongoose} from "../../db/db";
import {ObjectId} from "mongodb";
import {commentMapper} from "../types/comments/mappers/comment-mapper";
import {UpdateCommentModel} from "../types/comments/input.comments.model";
import {QueryCommentInputModel} from "../types/comments/query.comment.input.model";

export class CommentRepository {
    static async getCommentById(id:string):Promise<CommentModel|null>{
        const comment = await CommentModelMongoose.findOne({_id: new ObjectId(id)})

        if(!comment){
            return null
        }
        return commentMapper(comment)
    }

    static async updateCommentById(id:string, updatedData:UpdateCommentModel):Promise<boolean>{

        const comment = await CommentModelMongoose.updateOne({_id: new ObjectId(id)}, {$set:{content: updatedData.content}})

        return !!comment.matchedCount;
    }

    static async deleteCommentById(id:string):Promise<boolean>{
        const comment = await CommentModelMongoose.deleteOne({_id: new ObjectId(id)})

        return !!comment.deletedCount;
    }
}