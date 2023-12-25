import {Router, Response, Request} from "express";
import {BlogRepository} from "../repositories/blog_repository";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types/common";
import {authMiddleware} from "../middlewares/auth/auth_middleware";
import {blogValidation} from "../validators/blog-validator";
import {CreateBlogModel, UpdateBlogModel} from "../types/blogs/input";

export const blogRoute = Router({})

blogRoute.get('/', (req: Request, res:Response) => {
    const blogs = BlogRepository.getAllBlogs()

    res.status(200).send(blogs)
})

blogRoute.get('/:id', (req: RequestWithParams<{id: string}>, res:Response) => {
    const id = req.params.id
    const blog = BlogRepository.getBlogById(id)

    if (!blog) {
        res.sendStatus(404)
    }

    res.status(200).send(blog)
})

blogRoute.post('/', authMiddleware, blogValidation(), (req: RequestWithBody<CreateBlogModel>, res:Response) => {
    let {name, description, websiteUrl} = req.body
    const newBlog = BlogRepository.createBlog(name, description, websiteUrl)

    if (newBlog) {
        res.status(201).send(newBlog)
    }
    res.sendStatus(400)
})

blogRoute.put('/:id', authMiddleware, blogValidation(), (req: RequestWithParamsAndBody<{id: string},UpdateBlogModel>, res:Response) => {
    const id = req.params.id
    let {name, description, websiteUrl} = req.body
    const updatedBlogFlag = BlogRepository.updateBlogById(id, name, description, websiteUrl)

    if (updatedBlogFlag) {
         res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
    //const updatedBlog = BlogRepository.getBlogById(id)
})

blogRoute.delete('/:id', authMiddleware,(req: RequestWithParams<{id: string}>, res:Response) => {
    const id = req.params.id
    const deletedBlogFlag = BlogRepository.deleteBlogById(id)

    if (deletedBlogFlag) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})