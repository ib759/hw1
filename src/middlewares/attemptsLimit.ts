import {NextFunction, Request, Response} from "express";
import {AttemptRepository} from "../repositories/attempt_db_repository";

export const attemptsLimit = async (req:Request, res:Response, next: NextFunction) => {
    //req.baseUrl или req.originalUrl
    //фильтру (IP, URL, date >= текущей даты - 10 сек).
    //More than 5 attempts from one IP-address during 10 seconds

    const IP = req.ip!
    const URL= req.baseUrl
    const date = new Date()

    const periodOfTime = -10
    const maxNumberOfAttempts = 5

    const attemptsCount = await AttemptRepository.getAllDocumentsForPeriodOfTime(IP,periodOfTime)
debugger
    if(attemptsCount && attemptsCount >= maxNumberOfAttempts){             //or attemptsCount === 5
        res.sendStatus(429)
        return
    }

    const newAttempt = await AttemptRepository.addNewAttempt({IP, URL, date})

    if (!newAttempt){
        res.sendStatus(429)
        return
    }

    return next()

}