import {Router, Response, Request} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types/common";
import {authMiddleware} from "../middlewares/auth/auth_middleware";
import {CreatePostModel, UpdatePostModel} from "../types/posts/input";
import {PostRepository} from "../repositories/post_repository";
import {postValidation} from "../validators/post-validator";

export const postRoute = Router({})

postRoute.get('/', (req: Request, res:Response) => {
    const posts = PostRepository.getAllPosts()

    res.send(posts)
})

postRoute.get('/:id', (req: RequestWithParams<{id: string}>, res:Response) => {
    const id = req.params.id
    const post = PostRepository.getPostById(id)

    if (!post) {
        res.sendStatus(404)
    }

    res.send(post)
})

postRoute.post('/', authMiddleware, postValidation(), (req: RequestWithBody<CreatePostModel>, res:Response) => {
    let {title, shortDescription, content, blogId} = req.body
    const newPost = PostRepository.createPost(title, shortDescription, content, blogId)

    if (newPost) {
        res.status(201).send(newPost)
    }
})

postRoute.put('/:id', authMiddleware, postValidation(), (req: RequestWithParamsAndBody<{id: string},UpdatePostModel>, res:Response) => {
    const id = req.params.id
    let {title, shortDescription, content, blogId} = req.body
    const updatedPostFlag = PostRepository.updatePostById(id, title, shortDescription, content, blogId)

    if (updatedPostFlag) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

postRoute.delete('/:id', authMiddleware,(req: RequestWithParams<{id: string}>, res:Response) => {
    const id = req.params.id
    const deletedPostFlag = PostRepository.deletePostById(id)

    if (deletedPostFlag) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})