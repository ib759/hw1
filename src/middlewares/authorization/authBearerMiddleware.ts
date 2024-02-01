import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../applications/jwt-service";
import {UserQueryRepository} from "../../query-repositories/user_query_repository";

export const authBearerMiddleware = async (req:Request, res:Response, next: NextFunction) =>{
    if(!req.headers.authorization){
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)

    if(userId){
        req.user  = await UserQueryRepository.getUserById(userId.toString())
        return next()
    }
    res.sendStatus(401)
}