//import request from "supertest";
import * as request from 'supertest'
import {app} from "../../src/settings";
import {authService} from "../../src/services/auth-service";
import {usersService} from "../../src/services/user-service";

const delayFunction = (ms: number)=>{
    return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('/auth',  () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('get 429 after login try 6th time', async () => {

        //const user = await usersService.createUser({login: 'user1', password: '123456', email: 'yana_bhv@mail.ru'}, true)
//----------------checking attemptsLimit middleware----------------------------------------------------------------

        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'user1',
                password: '123456'
            })
            .expect(401)

        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'user1',
                password: '123456'
            })
            .expect(401)

        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'user1',
                password: '123456'
            })
            .expect(401)

        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'user1',
                password: '123456'
            })
            .expect(401)

        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'user1',
                password: '123456'
            })
            .expect(401)

        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'user1',
                password: '123456'
            })
            .expect(429)
    })

    it('wait 10 sec and get 401 after login try 5 times', async () => {

        await delayFunction(10000)
        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'user1',
                password: '123456'
            })
            .expect(401)
    })

    it('5 times registration with 400, 6th time with 429', async () => {

        await request(app)
            .post('/auth/registration')
            .send({login: '',
            password: '123456',
            email: ''
        })
            .expect(400)

        await request(app)
            .post('/auth/registration')
            .send({login: '',
                password: '123456',
                email: ''
            })
            .expect(400)

        await request(app)
            .post('/auth/registration')
            .send({login: '',
                password: '123456',
                email: ''
            })
            .expect(400)

        await request(app)
            .post('/auth/registration')
            .send({login: '',
                password: '123456',
                email: ''
            })
            .expect(400)

        await request(app)
            .post('/auth/registration')
            .send({login: '',
                password: '123456',
                email: ''
            })
            .expect(400)

        await request(app)
            .post('/auth/registration')
            .send({login: '',
                password: '123456',
                email: ''
            })
            .expect(429)
    })

    it('204 if email was resending', async () => {
        //const user = await usersService.createUser({login: 'user1', password: '123456', email: 'yana_bhv@mail.ru'}, false)
        const user = await authService.userRegistration({login: 'user1', password: '123456', email: 'yana_bhv@mail.ru'})

        await request(app)
            .post('/auth/registration-email-resending')
            .send({email: 'yana_bhv@mail.ru'})
            .expect(204)
    })
})