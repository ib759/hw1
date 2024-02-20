import {Request, Response, Router} from "express";
import {RequestWithParams, ResultCode} from "../types/common";
import {securityService} from "../services/security-service";
import {REFRESH_SECRET} from "../settings";
import {jwtService} from "../applications/jwt-service";
import {SecurityQueryRepository} from "../query-repositories/security_query_repository";
import {ObjectId} from "mongodb";

export const securityRoute = Router({})

securityRoute.get('/devices', async (req: Request, res: Response) => {

    if (!req.cookies['refreshToken']) {
        res.sendStatus(401)
        return
    }

    const refreshToken = req.cookies['refreshToken']
    const decodedToken = await jwtService.verifyRefreshToken(refreshToken, REFRESH_SECRET)

    if (!decodedToken) {
        res.sendStatus(401)
        return
    }
    const sessions = await SecurityQueryRepository.getAllSessionsForUser(decodedToken.userId)
    res.status(200).send(sessions)

})

securityRoute.delete('/devices', async (req: Request, res: Response) => {
    if (!req.cookies['refreshToken']) {
        res.sendStatus(401)
        return
    }

    const refreshToken = req.cookies['refreshToken']

    const isTerminated = await securityService.terminateAllSessionsWithoutCurrent(refreshToken)

    switch (isTerminated.resultCode) {
        case ResultCode.Verified:
            res.sendStatus(401)
            break
        case ResultCode.isDeleted:
            if(isTerminated.data){
                res.sendStatus(204)
                return
            }
            res.sendStatus(404)
            break
        default:
            res.sendStatus(404)
            break
    }
})

securityRoute.delete('/devices/:deviceId', async (req: RequestWithParams<{deviceId:string}>, res: Response) => {
    if (!req.cookies['refreshToken']) {
        res.sendStatus(401)
        return
    }

    const refreshToken = req.cookies['refreshToken']
    const deviceId = req.params.deviceId

    if (!ObjectId.isValid(deviceId)){
        res.sendStatus(404)
        return
    }

    const isTerminated = await securityService.terminateSession(refreshToken, deviceId)

    switch (isTerminated.resultCode) {
        case ResultCode.isDeleted:
            if (isTerminated.data) {
                res.sendStatus(204)
                return
            }
            res.sendStatus(404)
            break
        case ResultCode.Checked:
            res.sendStatus(403)
            break
        case ResultCode.Verified:
            if (isTerminated.data === false) {
                res.sendStatus(401)
                return
            }
            break
        default:
            res.sendStatus(404)
            break
    }
})