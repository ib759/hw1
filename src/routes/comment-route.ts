import {Response, Router} from "express";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/common";
import {CommentRepository} from "../repositories/comment_db_repository";
import {UpdateCommentModel} from "../types/comments/input.comments.model";
import {updateCommentValidator} from "../validators/comment-validator";
import {authBearerMiddleware} from "../middlewares/authorization/authBearerMiddleware";
import {checkUserForComments} from "../middlewares/authentication/userRightsForComments";

export const commentRoute = Router({})

commentRoute.get('/:id', async (req:RequestWithParams<{id:string}>, res: Response) => {
    const commentId = req.params.id

    const comment = await CommentRepository.getCommentById(commentId)

    if(!comment){
        res.sendStatus(404)
        return
    }
    res.status(200).send(comment)
})

commentRoute.put('/:commentId', authBearerMiddleware, checkUserForComments, updateCommentValidator(), async (req:RequestWithParamsAndBody<{commentId:string}, UpdateCommentModel>, res: Response)=> {
    const commentId = req.params.commentId
    const content = req.body.content

    const updatedComment  = await CommentRepository.updateCommentById(commentId, {content})

    if(!updatedComment){
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
})

commentRoute.delete('/:commentId', authBearerMiddleware, checkUserForComments, async (req: RequestWithParams<{commentId:string}>, res: Response) => {
    const commentId = req.params.commentId

    const deletedComment = await CommentRepository.deleteCommentById(commentId)

    if(!deletedComment){
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
})



