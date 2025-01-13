import {SecurityRepository} from "../repositories/security_db_repository";
import {refreshPayloadType} from "../types/tokens/token.models";
import {jwtService} from "../applications/jwt-service";
import {REFRESH_SECRET} from "../settings";
import {ResultCode, ResultObject} from "../types/common";
import {TokenRepository} from "../repositories/token_db_repository";

export const securityService = {
    async addSessionToTheList(decodedToken: refreshPayloadType, ipUser: string, title: string): Promise<boolean> {

        const sessionDB = {
            ip: ipUser,
            title: title,
            lastActiveDate: new Date(decodedToken.issuedAt*1000).toISOString(),
            deviceId: decodedToken.deviceId,
            userId: decodedToken.userId,
            issuedDate: decodedToken.issuedAt,
            expiredDate: decodedToken.expiresAt
        }
        const isAdded = await SecurityRepository.addSession(sessionDB)
        if (isAdded) return true //return isAdded
        return false
    },

    //terminate all other device's sessions exclude current
    async terminateAllSessionsWithoutCurrent(token: string): Promise<ResultObject<boolean>> {
        const decodedToken = await jwtService.verifyRefreshToken(token, REFRESH_SECRET)

        if (!decodedToken) return {
                                    resultCode: ResultCode.Verified,
                                    data: false
                                    } //return 401

        const deleted = await SecurityRepository.deleteSessionsWithoutCurrent(decodedToken.deviceId, decodedToken.userId)

        return{
            resultCode: ResultCode.isDeleted,
            data: deleted
        }
    },

    async deleteSessionBySessionId(sessionId: string):Promise<boolean>{

        return await SecurityRepository.deleteSession(sessionId)
    },

    async checkUserForDeviceDeleting(deviceId: string, userId: string):Promise<ResultObject<boolean>>{
        const session = await SecurityRepository.getSessionByDevicesId(deviceId)

        if(session){
            if(session.userId === userId) return {
                                                    resultCode: ResultCode.Checked,
                                                    data: true,
                                                    payload: session._id.toString()
                                                    }
            return {
                    resultCode: ResultCode.Checked,
                    data: false                     //return 403 this user can't delete this session{session._id.toString()}
                    }
        }
        return {
                resultCode: ResultCode.NotFound,
                data: true
                }
    },

    async terminateSession(token: string, deviceId: string): Promise<ResultObject<boolean>>{
        const decodedToken = await jwtService.verifyRefreshToken(token, REFRESH_SECRET)

        if (!decodedToken) return   {
                                    resultCode: ResultCode.Verified,
                                    data: false
                                    }

        const userId = decodedToken.userId

        const canBeDeleted = await this.checkUserForDeviceDeleting(deviceId, userId)

        if(canBeDeleted.resultCode === ResultCode.Checked && canBeDeleted.data){
            const isDeleted = await this.deleteSessionBySessionId(canBeDeleted.payload!)

            return {
                resultCode: ResultCode.isDeleted,
                data: isDeleted// if false - return 404, if true - return 204
            }
        }

        return  canBeDeleted
    }
}