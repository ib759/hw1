import {CommentDbType} from "../../db/db";
import {CommentModel} from "../output.comments.model";
import {WithId} from "mongodb";

export const commentMapper = (commentDB: WithId<CommentDbType>): CommentModel =>{
    return{
        id: commentDB._id.toString(),
        content: commentDB.content,
        commentatorInfo: {
            userId: commentDB.commentatorInfo.userId,
            userLogin: commentDB.commentatorInfo.userLogin
        },
        createdAt: commentDB.createdAt
    }
}