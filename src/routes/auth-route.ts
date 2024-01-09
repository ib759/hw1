import {Router, Request, Response} from "express";
import {RequestWithBody} from "../types/common";
import {authLoginInputModel} from "../types/users/auth.login.input.model";
import {UserRepository} from "../repositories/user_db_repository";
import {userAuthValidation} from "../validators/auth-user-validator";
import bcrypt from "bcryptjs";

export const authRoute = Router({})

authRoute.post('/login', userAuthValidation(), async (req: RequestWithBody<authLoginInputModel>, res: Response) => {
    let {loginOrEmail, password} = req.body

    const user = await UserRepository.getUserByLogin(loginOrEmail)

    if (!user) {
        res.sendStatus(401)
        return
    }

    const valid = await bcrypt.compare(password, user.password)

    if (valid){
        res.sendStatus(204)
    }else{
        res.sendStatus(401)
    }
})
