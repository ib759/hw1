import {SecurityRepository} from "../repositories/security_db_repository";
import {refreshPayloadType} from "../types/tokens/token.models";
import {jwtService} from "../applications/jwt-service";
import {REFRESH_SECRET} from "../settings";
import {ResultCode, ResultObject} from "../types/common";

export const securityService = {
    async addSessionToTheList(decodedToken: refreshPayloadType, ipUser: string, title: string): Promise<boolean> {

        const sessionDB = {
            ip: ipUser,
            title: title,
            lastActiveDate: decodedToken.issuedAt.toString(),
            deviceId: decodedToken.deviceId,
            userId: decodedToken.userId,
            issuedDate: decodedToken.issuedAt,
            expiredDate: decodedToken.expiresAt
        }
        const isAdded = await SecurityRepository.addSession(sessionDB)
        if (isAdded) return true
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

    async checkUserForDeviceDeleting(deviceId: string, userId: string):Promise<string|null>{
        const session = await SecurityRepository.getSessionByDevicesId(deviceId)

        if(session){
            if(session.userId === userId) return session._id.toString()
            return null
        }
        return null
    },

    async terminateSession(token: string, deviceId: string): Promise<ResultObject<boolean>>{
        const decodedToken = await jwtService.verifyRefreshToken(token, REFRESH_SECRET)

        if (!decodedToken) return   {
                                    resultCode: ResultCode.Verified,
                                    data: false
                                    }

        const userId = decodedToken.userId

        const canBeDeleted = await this.checkUserForDeviceDeleting(deviceId, userId)

        if (canBeDeleted){
            const isDeleted = await this.deleteSessionBySessionId(canBeDeleted)
            return {
                    resultCode: ResultCode.isDeleted,
                    data: isDeleted// if false - return 404, if true - return 204
                    }
            }
        // if (!canBeDeleted) this user cant delete this session
        return  {
                resultCode: ResultCode.Checked,
                data: false
                } //return 403 this user can't delete this session

    }
}