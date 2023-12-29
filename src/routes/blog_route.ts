import {Router, Response, Request} from "express";
import {BlogRepository} from "../repositories/blog_db_repository";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types/common";
import {authMiddleware} from "../middlewares/auth/auth_middleware";
import {blogValidation} from "../validators/blog-validator";
import {CreateBlogModel, UpdateBlogModel} from "../types/blogs/input";
import {ObjectId} from "mongodb";

export const blogRoute = Router({})

blogRoute.get('/', async (req: Request, res:Response) => {
    const blogs = await BlogRepository.getAllBlogs()

    res.status(200).send(blogs)
})

blogRoute.get('/:id', async (req: RequestWithParams<{id: string}>, res:Response) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)){
        res.sendStatus(404)
        return
    }
    const blog = await BlogRepository.getBlogById(id)

    if (!blog) {
        res.sendStatus(404)
        return
    }

    res.status(200).send(blog)
})

blogRoute.post('/', authMiddleware, blogValidation(), async (req: RequestWithBody<CreateBlogModel>, res:Response) => {
    let {name, description, websiteUrl} = req.body
    const newBlog = await  BlogRepository.createBlog({name, description, websiteUrl})

    const checkInsertion = await BlogRepository.getBlogById(newBlog.id)
    if (!checkInsertion) {
        res.sendStatus(400)
        return
    }
    res.status(201).send(checkInsertion)
})

blogRoute.put('/:id', authMiddleware, blogValidation(), async (req: RequestWithParamsAndBody<{id: string},UpdateBlogModel>, res:Response) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)){
        res.sendStatus(404)
        return
    }

    let {name, description, websiteUrl} = req.body
    const updatedBlogFlag = await BlogRepository.updateBlogById(id, {name, description, websiteUrl})

    if (!updatedBlogFlag) {
         res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
    //const updatedBlog = BlogRepository.getBlogById(id)
})

blogRoute.delete('/:id', authMiddleware,async (req: RequestWithParams<{id: string}>, res:Response) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)){
        res.sendStatus(404)
        return
    }

    const deletedBlogFlag = await BlogRepository.deleteBlogById(id)

    if (!deletedBlogFlag) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})