import request from 'supertest'
import {app} from "../../src/settings";

export let createdBlogForPost: any = null

describe('/blogs',  () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('test get /blogs return 200 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(200, [])
    })

    it('test get /blogs/:id : return 404 if blog does not exist', async () => {
        await request(app)
            .get('/blogs/no')
            .expect(404)
    })

    it(' test post: should not create blog with incorrect input data', async () => {
        await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({name: ''})
            .expect(400)

        await request(app)
            .get('/blogs')
            .expect(200, [])
    })

    it(' test post chain middlewares: firstly check authorization, should not create blog with incorrect login or password', async () => {
        await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlR5')
            .send({name: ''})
            .expect(401)

        await request(app)
            .get('/blogs')
            .expect(200, [])
    })


    it('test post: should create blog with correct input data', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({name: 'string',
                        description: 'string',
                        websiteUrl: 'https://v.HSyPCmSrkhMt7nBA-pLKkXZXgdZijaoBfXNMgCwpcn9lWLzru_CZ3UpQODVPQoEL7gzbV3xURrgFE4.vr6F1Q7_Y3o'
                        })
            .expect(201)
        createdBlogForPost = createResponse.body;

        expect(createdBlogForPost).toEqual({
            id: expect.any(String),
            name: 'string',
            description: 'string',
            websiteUrl: 'https://v.HSyPCmSrkhMt7nBA-pLKkXZXgdZijaoBfXNMgCwpcn9lWLzru_CZ3UpQODVPQoEL7gzbV3xURrgFE4.vr6F1Q7_Y3o',
            createdAt: expect.any(String),
            isMembership: false
        })

        await request(app)
            .get('/blogs')
            .expect(200, [createdBlogForPost])
    })

    let createdBlogForDelete: any = null
    it('should create blog for checking delete option', async () => {
        const createResponseForDelete = await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({name: 'string',
                        description: 'string',
                        websiteUrl: 'https://v.HSyPCmSrkhMt7nBA-pLKkXZXgdZijaoBfXNMgCwpcn9lWLzru_CZ3UpQODVPQoEL7gzbV3xURrgFE4.vr6F1Q7_Y3o'
            })
            .expect(201)
        createdBlogForDelete = createResponseForDelete.body;

        expect(createdBlogForDelete).toEqual({
            id: expect.any(String),
            name: 'string',
            description: 'string',
            websiteUrl: 'https://v.HSyPCmSrkhMt7nBA-pLKkXZXgdZijaoBfXNMgCwpcn9lWLzru_CZ3UpQODVPQoEL7gzbV3xURrgFE4.vr6F1Q7_Y3o',
            createdAt: expect.any(String),
            isMembership: false
        })

        await request(app)
            .get('/blogs')
            .expect(200, [createdBlogForPost, createdBlogForDelete])
    })

    it('test put: should not update blog with incorrect input data', async () => {
        await request(app)
            .put('/blogs/' + createdBlogForPost.id)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({name: ''})
            .expect(400)

        await request(app)
            .get('/blogs/' + createdBlogForPost.id)
            .expect(200, createdBlogForPost)
    })

    it('test put: should not update not existed blog with correct input data', async () => {
        await request(app)
            .put('/blogs/' + -100)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({name: 'string',
                description: 'string',
                websiteUrl: 'https://haleV_tFWC31KERUXT3nROMiRdCr_kWx0Nzs3_ElVhK0CDsQNk1o5YIGCBz.6EzBgEY-Nk38J2pgNmTMrEYJfocn7KDM'
            })
            .expect(404)
    })

    it('test put: should not update blog with incorrect login/password and correct input data', async () => {
        await request(app)
            .put('/blogs/' + createdBlogForPost.id)
            .set('authorization', 'Basic YWRtaW46cXdlR5')//incorrect login/password
            .send({name: 'string',
                description: 'string',
                websiteUrl: 'https://haleV_tFWC31KERUXT3nROMiRdCr_kWx0Nzs3_ElVhK0CDsQNk1o5YIGCBz.6EzBgEY-Nk38J2pgNmTMrEYJfocn7KDM'
            })
            .expect(401)

        await request(app)
            .get('/blogs/' + createdBlogForPost.id)
            .expect(200, {
                ...createdBlogForPost,
                name: 'string',
                description: 'string',
                websiteUrl: 'https://v.HSyPCmSrkhMt7nBA-pLKkXZXgdZijaoBfXNMgCwpcn9lWLzru_CZ3UpQODVPQoEL7gzbV3xURrgFE4.vr6F1Q7_Y3o'
            })
    })

    it('test put: should update blog with correct login/password and input data', async () => {
        await request(app)
            .put('/blogs/' + createdBlogForPost.id)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({name: 'string',
                description: 'string',
                websiteUrl: 'https://haleV_tFWC31KERUXT3nROMiRdCr_kWx0Nzs3_ElVhK0CDsQNk1o5YIGCBz.6EzBgEY-Nk38J2pgNmTMrEYJfocn7KDM'
            })
            .expect(204)

        await request(app)
            .get('/blogs/' + createdBlogForPost.id)
            .expect(200, {
                ...createdBlogForPost,
                name: 'string',
                description: 'string',
                websiteUrl: 'https://haleV_tFWC31KERUXT3nROMiRdCr_kWx0Nzs3_ElVhK0CDsQNk1o5YIGCBz.6EzBgEY-Nk38J2pgNmTMrEYJfocn7KDM'
            })
    })

    it('test delete: should not delete target blog with incorrect login/password', async () => {
        await request(app)
            .delete('/blogs/' + createdBlogForDelete.id)
            .set('authorization', 'Basic YWRtaW46cXdlR5')//incorrect login/password
            .expect(401)

        await request(app)
            .get('/blogs/' + createdBlogForDelete.id)
            .expect(200)
    })

    it('test delete: should delete target blog with correct login/password', async () => {
        await request(app)
            .delete('/blogs/' + createdBlogForDelete.id)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204)

        await request(app)
            .get('/blogs/' + createdBlogForDelete.id)
            .expect(404)
    })

    //check blog availability for creating post in target blog
    it('test get /blogs/:id : return target blog', async () => {
        await request(app)
            .get('/blogs/' + createdBlogForPost.id)
            .expect(200)
    })

})