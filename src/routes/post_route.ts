import {Router, Response, Request} from "express";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../types/common";
import {authMiddleware} from "../middlewares/authorization/auth_middleware";
import {CreatePostModel, UpdatePostModel} from "../types/posts/input";
import {PostRepository} from "../repositories/post_db_repository";
import {postValidation} from "../validators/post-validator";
import {ObjectId} from "mongodb";
import {QueryPostInputModel} from "../types/posts/query.post.input.models";
import {CreateCommentModel} from "../types/comments/input.comments.model";
import {createCommentValidator} from "../validators/comment-validator";
import {CommentRepository} from "../repositories/comment_db_repository";
import {QueryCommentInputModel} from "../types/comments/query.comment.input.model";
import {authBearerMiddleware} from "../middlewares/authorization/authBearerMiddleware";

export const postRoute = Router({})

postRoute.get('/', async (req: RequestWithQuery<QueryPostInputModel>, res:Response) => {
    const sortData: QueryPostInputModel = {
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection
    }

    const posts = await PostRepository.getAllPosts(sortData)

    res.status(200).send(posts)
})

postRoute.get('/:id', async (req: RequestWithParams<{id: string}>, res:Response) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)){
        res.sendStatus(404)
        return
    }

    const post = await PostRepository.getPostById(id)

    if (!post) {
        res.sendStatus(404)
        return
    }

    res.status(200).send(post)
})

postRoute.post('/', authMiddleware, postValidation(), async (req: RequestWithBody<CreatePostModel>, res:Response) => {
    let {title, shortDescription, content, blogId} = req.body
    const newPost = await PostRepository.createPost({title, shortDescription, content, blogId})
    if (!newPost) {
        res.sendStatus(404)
        return
    }
    const checkInsertion = await PostRepository.getPostById(newPost.id)

    if (!checkInsertion) {
        res.sendStatus(400)
        return
    }
    res.status(201).send(checkInsertion)
})

postRoute.put('/:id', authMiddleware, postValidation(), async (req: RequestWithParamsAndBody<{id: string},UpdatePostModel>, res:Response) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)){
        res.sendStatus(404)
        return
    }

    let {title, shortDescription, content, blogId} = req.body
    const updatedPostFlag = await PostRepository.updatePostById(id, {title, shortDescription, content, blogId})

    if (!updatedPostFlag) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)

})

postRoute.delete('/:id', authMiddleware,async (req: RequestWithParams<{id: string}>, res:Response) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)){
        res.sendStatus(404)
        return
    }

    const deletedPostFlag = await PostRepository.deletePostById(id)

    if (!deletedPostFlag) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

postRoute.post('/:postId/comments', authBearerMiddleware, createCommentValidator(), async (req:RequestWithParamsAndBody<{postId:string}, CreateCommentModel>, res:Response)=> {
    const postId = req.params.postId
    const content = req.body.content
    const user  = req.user! //after authorization user exists

    const post = await PostRepository.getPostById(postId)

    if(!post){
        res.sendStatus(404)
        return
    }

    const comment = await PostRepository.createCommentByPost(postId, user,{content})

    if (!comment){
        res.sendStatus(404)
        return
    }

    const checkInsertion = await CommentRepository.getCommentById(comment.id)

    if(!checkInsertion){
        res.sendStatus(404)
        return
    }

    res.status(201).send(checkInsertion)
})

postRoute.get('/:postId/comments', async(req:RequestWithParamsAndQuery<{postId: string }, QueryCommentInputModel>, res:Response) => {
    const postId = req.params.postId

    const post  = await PostRepository.getPostById(postId)

    if(!post){
        res.sendStatus(404)
        return
    }

    const sortData:QueryCommentInputModel = {
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection
    }

    const comments = await PostRepository.getCommentsByPostId(postId, sortData)

    res.status(200).send(comments)
})