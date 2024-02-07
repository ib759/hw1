import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../applications/jwt-service";
import {UserRepository} from "../../repositories/user_db_repository";
import {JWT_SECRET} from "../../settings";

export const authBearerMiddleware = async (req:Request, res:Response, next: NextFunction) =>{
    if(!req.headers.authorization){
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.verifyTokenGetUserId(token, JWT_SECRET)

    if(userId){
        req.user  = await UserRepository.getUserById(userId)
        return next()
    }
    res.sendStatus(401)
}