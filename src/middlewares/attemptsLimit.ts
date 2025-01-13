import {NextFunction, Request, Response} from "express";
import {AttemptRepository} from "../repositories/attempt_db_repository";
import {maxNumberOfAttempts, periodOfTime} from "../settings";

export const attemptsLimit = async (req:Request, res:Response, next: NextFunction) => {
    //More than 5 attempts from one IP-address during 10 seconds
//debugger
    const IP = req.ip!
    const URL= req.originalUrl


    const attemptsCount = await AttemptRepository.getAllDocumentsForPeriodOfTime(IP, URL,periodOfTime)

    if(attemptsCount && attemptsCount >= maxNumberOfAttempts){
        res.sendStatus(429)
        return
    }

    const newAttempt = await AttemptRepository.addNewAttempt(IP, URL)

    if (!newAttempt){
        res.sendStatus(404)
        return
    }

    return next()
}