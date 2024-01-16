import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../applications/jwt-service";
import {usersService} from "../../services/user-service";

export const authBearerMiddleware = async (req:Request, res:Response, next: NextFunction) =>{
    if(!req.headers.authorization){
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)

    if(userId){
        req.user  = await usersService.findUserById(userId.toString())
        return next()
    }
    res.sendStatus(401)
}