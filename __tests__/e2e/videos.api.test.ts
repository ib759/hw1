import request from 'supertest'
import {app} from "../../src/settings";


describe('/videos',  () => {
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

})
