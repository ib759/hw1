import request from 'supertest'
import {app} from "../../src/settings";
import {BlogRepository} from "../../src/repositories/blog_repository";
import {createdBlogForPost} from "./blogs.api.test";

//const BlogForCreatePostId = createdBlogForPost.id
const CheckPost = BlogRepository.createBlog("string", "string", "https://17Un.q9.4KmRBjmOcz5H1MEvs3RGbhxwo4F0Ihyl73PYkDlusur0dBNC4pxWticoziE_n7i69ddyIIS.uKHtVusStFMh")
const BlogForCreatePostId = CheckPost.id

const CheckPut = BlogRepository.createBlog("string", "string", "https://10Un.q9.4KmRBjmOcz5H1MEvs3RGbhxwo4F0Ihyl73PYkDlusur0dBNC4pxWticoziE_n7i69ddyIIS.uKHtVusStHHm")
const BlogForUpdatePostId = CheckPut.id

describe('/posts',  () => {

    it('test get /posts return 200 and empty array', async () => {
        await request(app)
            .get('/posts')
            .expect(200, [])
    })

    it('test get /posts/:id : return 404 if post does not exist', async () => {
        await request(app)
            .get('/posts/no')
            .expect(404)
    })


    it(' test post: should not create new post with incorrect input data', async () => {
        await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({title: ''})
            .expect(400)

        await request(app)
            .get('/posts')
            .expect(200, [])
    })

    it(' test post chain middlewares: firstly check authorization, should not create new post with incorrect login or password', async () => {
        await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlR5')
            .send({title: ''})
            .expect(401)

        await request(app)
            .get('/posts')
            .expect(200, [])
    })

    let createdPost: any = null
    it('test post: should create new post with correct input data', async () => {
        const createResponsePost = await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({title: 'string',
                shortDescription: 'string',
                content: 'string',
                blogId: BlogForCreatePostId})
            .expect(201)
        createdPost = createResponsePost.body;

        expect(createdPost).toEqual({
            id: expect.any(String),
            title: 'string',
            shortDescription: 'string',
            content: 'string',
            blogId: BlogForCreatePostId,
            blogName: expect.any(String)
        })

        await request(app)
            .get('/posts')
            .expect(200, [createdPost])
    })

    let createdPostForDelete: any = null
    it('should create post for checking delete option', async () => {
        const createResponsePostForDelete = await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({title: 'string',
                shortDescription: 'string',
                content: 'string',
                blogId: BlogForCreatePostId})
            .expect(201)
        createdPostForDelete = createResponsePostForDelete.body;

        expect(createdPostForDelete).toEqual({
            id: expect.any(String),
            title: 'string',
            shortDescription: 'string',
            content: 'string',
            blogId: BlogForCreatePostId,
            blogName: expect.any(String)
        })

        await request(app)
            .get('/posts')
            .expect(200, [createdPost, createdPostForDelete])
    })

    it('test put: should not update post with incorrect input data', async () => {
        await request(app)
            .put('/posts/' + createdPost.id)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({title: ''})
            .expect(400)

        await request(app)
            .get('/posts/' + createdPost.id)
            .expect(200, createdPost)
    })

    it('test put: should not update not existed post with correct input data', async () => {
        await request(app)
            .put('/posts/' + -100)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5') //correct login/password
            .send({title: 'string',
                shortDescription: 'string',
                content: 'string',
                blogId: BlogForUpdatePostId})
            .expect(404)
    })

    it('test put: should not update blog with incorrect login/password and correct input data', async () => {
        await request(app)
            .put('/posts/' + createdPost.id)
            .set('authorization', 'Basic YWRtaW46cXdlR5')//incorrect login/password
            .send({title: 'string',
                shortDescription: 'string',
                content: 'string',
                blogId: BlogForUpdatePostId})
            .expect(401)

        await request(app)
            .get('/posts/' + createdPost.id)
            .expect(200, {
                ...createdPost,
                title: 'string',
                shortDescription: 'string',
                content: 'string',
                blogId: BlogForCreatePostId// blogId is not changed
            })
    })

    it('test put: should update blog with correct login/password and input data', async () => {
        await request(app)
            .put('/posts/' + createdPost.id)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')//correct login/password
            .send({title: 'string',
                shortDescription: 'string',
                content: 'string',
                blogId: BlogForUpdatePostId})
            .expect(204)

        await request(app)
            .get('/posts/' + createdPost.id)
            .expect(200, {
                ...createdPost,
                title: 'string',
                shortDescription: 'string',
                content: 'string',
                blogId: BlogForUpdatePostId //updated blogId
            })
    })

    it('test delete: should not delete target post with incorrect login/password', async () => {
        await request(app)
            .delete('/posts/' + createdPostForDelete.id)
            .set('authorization', 'Basic YWRtaW46cXdlR5')//incorrect login/password
            .expect(401)

        await request(app)
            .get('/posts/' + createdPostForDelete.id)
            .expect(200)
    })

    it('test delete: should delete target blog with correct login/password', async () => {
        await request(app)
            .delete('/posts/' + createdPostForDelete.id)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5') //correct login/password
            .expect(204)

        await request(app)
            .get('/posts/' + createdPostForDelete.id)
            .expect(404)
    })

    //check blog availability for creating post in target blog
    it('test get /posts/:id : return target post', async () => {
        await request(app)
            .get('/posts/' + createdPost.id)
            .expect(200)
    })










})

/*describe('/videos',  () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('test get /videos return 200 and empty array', async () => {
        await request(app)
            .get('/videos')
            .expect(200, [])
    })

    it('test get /videos/:id : return 404 if video does not exist', async () => {
        await request(app)
            .get('/videos/no')
            .expect(404)
    })

    it(' test post: should not create video with incorrect input data', async () => {
        await request(app)
            .post('/videos')
            .send({title: ''})
            .expect(400)

        await request(app)
            .get('/videos')
            .expect(200, [])
    })


    let createdVideo: any = null
    it('test post: should create video with correct input data', async () => {
        const createResponse = await request(app)
            .post('/videos')
            .send({title: 'new_video',
                        author: 'new_author',
                        availableResolutions: [
                            "P144"
                        ]
            })
            .expect(201)
        createdVideo = createResponse.body;

        expect(createdVideo).toEqual({
            id: expect.any(Number),
            title: 'new_video',
            author: 'new_author',
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: [
                "P144"
            ]
        })

        await request(app)
            .get('/videos')
            .expect(200, [createdVideo])
    })

    it('test get /videos/:id : return target video', async () => {
        await request(app)
            .get('/videos/' + createdVideo.id)
            .expect(200)
    })

    let createdVideoForDelete: any = null
    it('should create video for checking delete option', async () => {
        const createResponseForDelete = await request(app)
            .post('/videos')
            .send({title: 'new_video',
                author: 'new_author',
                availableResolutions: [
                    "P144"
                ]
            })
            .expect(201)
        createdVideoForDelete = createResponseForDelete.body;

        expect(createdVideoForDelete).toEqual({
            id: expect.any(Number),
            title: 'new_video',
            author: 'new_author',
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: [
                "P144"
            ]
        })

        await request(app)
            .get('/videos')
            .expect(200, [createdVideo, createdVideoForDelete])
    })
    it('test put: should not update video with incorrect input data', async () => {
        await request(app)
            .put('/videos/' + createdVideo.id)
            .send({title: ''})
            .expect(400)

        await request(app)
            .get('/videos/' + createdVideo.id)
            .expect(200, createdVideo)
    })

    it('test put: should not update not existed video with correct input data', async () => {
        await request(app)
            .put('/videos/' + -100)
            .send({title: 'string',
                        author: 'string',
                        availableResolutions: [
                            "P144"
                        ],
                        canBeDownloaded: true,
                        minAgeRestriction: 18,
                        publicationDate: '2023-12-17T12:58:29.396Z',
            })
            .expect(404)

        await request(app)
            .get('/videos/' + createdVideo.id)
            .expect(200, createdVideo)
    })

    it('test put: should update with correct input data', async () => {
        await request(app)
            .put('/videos/' + createdVideo.id)
            .send({title: 'string',
                        author: 'string',
                        availableResolutions: [
                            "P144"
                        ],
                        canBeDownloaded: true,
                        minAgeRestriction: 18,
                        publicationDate: '2023-12-17T12:58:29.396Z',
                        })
            .expect(204)

        await request(app)
            .get('/videos/' + createdVideo.id)
            .expect(200, {
                ...createdVideo,
                title: 'string',
                author: 'string',
                availableResolutions: [
                    "P144"
                ],
                canBeDownloaded: true,
                minAgeRestriction: 18,
                publicationDate: '2023-12-17T12:58:29.396Z',
            })
    })

    it('test delete: should delete target video', async () => {
        await request(app)
            .delete('/videos/' + createdVideoForDelete.id)
            .expect(204)

        await request(app)
            .get('/videos/' + createdVideoForDelete.id)
            .expect(404)
    })

})*/
