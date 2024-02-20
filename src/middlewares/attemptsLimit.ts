import {NextFunction, Request, Response} from "express";
import {AttemptRepository} from "../repositories/attempt_db_repository";
import {maxNumberOfAttempts, periodOfTime} from "../settings";

export const attemptsLimit = async (req:Request, res:Response, next: NextFunction) => {
    //req.baseUrl или req.originalUrl
    //фильтру (IP, URL, date >= текущей даты - 10 сек).
    //More than 5 attempts from one IP-address during 10 seconds

    const IP = req.ip!
    const URL= req.baseUrl


    const attemptsCount = await AttemptRepository.getAllDocumentsForPeriodOfTime(IP,periodOfTime)

    if(attemptsCount && attemptsCount === maxNumberOfAttempts){
        res.sendStatus(429)
        return
    }

    const date = new Date()
    const newAttempt = await AttemptRepository.addNewAttempt({IP, URL, date})

    if (!newAttempt){
        res.sendStatus(429)
        return
    }

    return next()

}