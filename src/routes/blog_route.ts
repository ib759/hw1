import {Router, Response, Request} from "express";
import {BlogRepository} from "../repositories/blog_db_repository";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../types/common";
import {authMiddleware} from "../middlewares/auth/auth_middleware";
import {blogValidation} from "../validators/blog-validator";
import {CreateBlogModel, CreatePostByBlog, UpdateBlogModel} from "../types/blogs/input";
import {ObjectId} from "mongodb";
import {QueryBlogInputModel, QueryPostByBlogIdInputModel} from "../types/blogs/query.blog.input.models";
import {PostRepository} from "../repositories/post_db_repository";
import {postValidationByBlog} from "../validators/post-validator";

export const blogRoute = Router({})

blogRoute.get('/', async (req: RequestWithQuery<QueryBlogInputModel>, res:Response) => {
    const sortData: QueryBlogInputModel = {
        searchNameTerm: req.query.searchNameTerm,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize
    }
    const blogs = await BlogRepository.getAllBlogs(sortData)

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

blogRoute.get('/:id/posts', async (req: RequestWithParamsAndQuery<{id: string}, QueryPostByBlogIdInputModel>, res:Response) => {

    const id = req.params.id
    if (!ObjectId.isValid(id)){
        res.sendStatus(404)
        return
    }

    const checkBlogId = await BlogRepository.getBlogById(id)

    if (!checkBlogId) {
        res.sendStatus(404) //blog with this id doesnt exist
        return
    }

    const sortData = {
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
    }


    const posts = await BlogRepository.getPostsByBlogId(id, sortData)

    res.status(200).send(posts)
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

blogRoute.post('/:id/posts', authMiddleware, postValidationByBlog(), async (req: RequestWithParamsAndBody<{id:string}, CreatePostByBlog>, res:Response) => {
    let {title, shortDescription, content} = req.body
    const blogId = req.params.id

    const blog = await BlogRepository.getBlogById(blogId)

    if(!blog) {
        res.sendStatus(404)
        return
    }

    const createdPostId = await BlogRepository.createPostToBlog(blogId, {title, shortDescription, content})
     if (!createdPostId) {
         res.sendStatus(404)
         return
     }
    const post = await PostRepository.getPostById(createdPostId)

    if (!post) {
        res.sendStatus(404)
        return
    }
    res.status(201).send(post)
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