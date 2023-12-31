import {Router, Response, Request} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types/common";
import {authMiddleware} from "../middlewares/auth/auth_middleware";
import {CreatePostModel, UpdatePostModel} from "../types/posts/input";
import {PostRepository} from "../repositories/post_db_repository";
import {postValidation} from "../validators/post-validator";
import {ObjectId} from "mongodb";
import {BlogRepository} from "../repositories/blog_db_repository";
import {QueryBlogInputModel} from "../types/blogs/query.blog.input.models";
import {QueryPostInputModel} from "../types/posts/query.post.input.models";

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