import {RequestWithParams} from "../../types/common";
import {NextFunction, Response} from "express";
import {CommentRepository} from "../../repositories/comment_db_repository";


export const checkUserForComments = async (req:RequestWithParams<{commentId:string}>, res:Response, next:NextFunction) =>{
    const commentId = req.params.commentId

    const comment = await CommentRepository.getCommentById(commentId)

    if(!comment){
        res.sendStatus(404)
        return
    }

    if(comment.commentatorInfo.userId !== req.user!.id){
        res.sendStatus(403)
        return
    }
    next()
}