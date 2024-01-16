import {Router, Request, Response} from "express";
import {RequestWithBody} from "../types/common";
import {authLoginInputModel} from "../types/users/auth.login.input.model";
import {userAuthValidation} from "../validators/auth-user-validator";
import {jwtMapper, jwtService} from "../applications/jwt-service";
import {usersService} from "../services/user-service";
import {authBearerMiddleware} from "../middlewares/authorization/authBearerMiddleware";


export const authRoute = Router({})

authRoute.post('/login', userAuthValidation(), async (req: RequestWithBody<authLoginInputModel>, res: Response) => {
    let {loginOrEmail, password} = req.body
    //res.send('123')
    const valid= await usersService.checkCredentials(loginOrEmail, password)
    const user = await usersService.getUserWithoutPassword(loginOrEmail)

    if (!user){
        res.sendStatus(401)
        return
    }

    if (valid){
        const token = await jwtService.createJWT(user)
        const jwtToken = jwtMapper(token)
        res.status(200).send(jwtToken)
    }else{
        res.sendStatus(401)
    }
})

authRoute.get('/me', authBearerMiddleware, async(req:Request, res:Response) =>{

    /*if(!req.user){
        res.sendStatus(401)
        return
    }*/

    const userReq = req.user!
    const user = await usersService.getCurrentUser(userReq)
    res.status(200).send(user)

})
