import express, {Request, Response} from 'express'
import {VideoDbType} from "./types/common";
import {blogRoute} from "./routes/blog_route";
import {postRoute} from "./routes/post_route";
import {testingRoute} from "./routes/testing-route";
import {authRoute} from "./routes/auth-route";
import {userRoute} from "./routes/user-route";
import {commentRoute} from "./routes/comment-route";

export const app = express()

app.use(express.json())

app.use('/blogs', blogRoute)
app.use('/posts', postRoute)
app.use('/testing',testingRoute)
app.use('/users',userRoute)
app.use('/auth',authRoute)
app.use('/comments',commentRoute)

export const JWT_SECRET = process.env.JWT_SECRET || "123"

// ------not used from first homework----------------

/*const videos: VideoDbType[] = [
    {
        id: 0,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023-12-08T13:55:39.148Z",
        publicationDate: "2023-12-08T13:55:39.148Z",
        availableResolutions: [
            "P144"
        ]
    }
]

app.get('/videos', (req: Request, res: Response) => {
    res.status(200).send(videos)
})

app.get('/videos/:id', (req: RequestWithParams<{id: string}>, res: Response) => {
    const id = +req.params.id

    const video = videos.find((v)=> v.id === id)

    if (!video){
        res.sendStatus(404)
        return
    }

    res.status(200).send(video)
})

app.post('/videos', (req:RequestWithBody<CreateVideoType>,res: Response) => {
    let errors: ErrorType = {
        errorsMessages: []
    }

    let {title, author, availableResolutions} = req.body

    if (!title || typeof title !== 'string' || !title.trim() || title.trim().length > 40){
        errors.errorsMessages.push({message: 'Invalid title!', field: 'title'})
    }

    if (!author || typeof author !== 'string' || !author.trim() || author.trim().length > 20){
        errors.errorsMessages.push({message: 'Invalid author!', field: 'author'})
    }

    if (availableResolutions && Array.isArray(availableResolutions)){
        availableResolutions.forEach((r) => {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({message: 'Invalid availableResolutions', field: 'availableResolutions'})
        })
    }else {
        availableResolutions = []
    }

    if (errors.errorsMessages.length){
        res.status(400).send(errors)
        return
    }

    const createdAt = new Date()
    const publicationDate = new Date()

    publicationDate.setDate(createdAt.getDate()+1)

    const newVideo: VideoDbType = {
        id: +(new Date()),
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions
    }

    videos.push(newVideo)

    res.status(201).send(newVideo)
})

app.delete('/videos/:id', (req: RequestWithParams<{id: string}>, res: Response) => {
    for (let i=0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i,1);
            res.sendStatus(204);
            return;
        }
    }

    res.sendStatus(404);
})

app.delete('/testing/all-data', (req: Request, res: Response) => {

    videos.length = 0;

    res.sendStatus(204);
})

app.put('/videos/:id', (req: RequestWithParamsAndBody<{id: string},InputModel>, res: Response) => {

    //let errors_put: ErrorType
    let errors_put: ErrorType = {
        errorsMessages: []
    }

    let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body

    if (!title || typeof title !== 'string' || !title.trim() || title.trim().length > 40){
        errors_put.errorsMessages.push({message: 'Invalid title!', field: 'title'})
    }

    if (!author || typeof author !== 'string' || !author.trim() || author.trim().length > 20){
        errors_put.errorsMessages.push({message: 'Invalid author!', field: 'author'})
    }
    if (availableResolutions && Array.isArray(availableResolutions)){
        availableResolutions.forEach((r) => {
            !AvailableResolutions.includes(r) && errors_put.errorsMessages.push({message: 'Invalid availableResolutions', field: 'availableResolutions'})
        })
    }else {
        availableResolutions = []
    }

    if (!canBeDownloaded || typeof canBeDownloaded !== 'boolean'){
        errors_put.errorsMessages.push({message: 'Invalid canBeDownloaded field!', field: 'canBeDownloaded'})
    }

    if(!minAgeRestriction){
        errors_put.errorsMessages.push({message: 'Invalid minAgeRestriction field!', field: 'minAgeRestriction'})
    }
    if ( minAgeRestriction && typeof minAgeRestriction != null) {
        if (typeof minAgeRestriction !== 'number' || minAgeRestriction >= 18 || minAgeRestriction <= 1) {
            errors_put.errorsMessages.push({message: 'Invalid minAgeRestriction field!', field: 'minAgeRestriction'})
        }
    }

    if (!publicationDate || typeof publicationDate !== 'string' || !publicationDate.trim() || publicationDate.trim().length > 40){
        errors_put.errorsMessages.push({message: 'Invalid publicationDate!', field: 'publicationDate'})
    }

    if (errors_put.errorsMessages.length){
        res.status(400).send(errors_put)
        return
    }

    const id = +req.params.id

    const video = videos.find((v)=> v.id === id)

    if (!video){
        res.sendStatus(404)
        return
    }

    video.title = req.body.title
    video.author = req.body.author
    video.availableResolutions = req.body.availableResolutions
    video.canBeDownloaded = req.body.canBeDownloaded
    video.minAgeRestriction = req.body.minAgeRestriction
    video.publicationDate = req.body.publicationDate

    res.sendStatus(204)
})

 */