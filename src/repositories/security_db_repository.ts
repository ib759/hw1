import {devicesDBType} from "../types/db/db";
import {sessionCollection, SessionModelMongoose} from "../../db/db";
import {ObjectId, WithId} from "mongodb";
import {refreshPayloadType} from "../types/tokens/token.models";

export class SecurityRepository {

    static async addSession(sessionDB: devicesDBType):Promise<string|null>{
        try{
            const session = await SessionModelMongoose.insertMany([sessionDB])
            return session[0]._id.toString()
        }catch (e) {
            return null
        }
    }

    static async updateSessionWithNewRefreshToken(decoded: refreshPayloadType):Promise<boolean>{
        try{
            const isUpdated = await SessionModelMongoose
                .updateOne({$and:[{userId: decoded.userId}, {deviceId: decoded.deviceId}]},
                    {$set: {'issuedDate': decoded.issuedAt,
                                    'expiredDate': decoded.expiresAt,
                                    'lastActiveDate': new Date(decoded.issuedAt*1000).toISOString()
                                    }})
            return !!isUpdated.matchedCount
        }catch (e) {
            return false
        }
    }

    static async deleteSession(sessionId: string): Promise<boolean>{
        const deleted = await SessionModelMongoose
            .deleteOne({_id: new ObjectId(sessionId)})
        return !!deleted.deletedCount
    }

    static async deleteSessionsWithoutCurrent(deviceId: string, userId: string): Promise<boolean>{
        const deleted = await SessionModelMongoose
            .deleteMany({$or:[{deviceId: {$ne: deviceId}},{userId: {$ne:userId}}]})
        return !!deleted.deletedCount
    }

    static async deleteCurrentSessionForLogout(deviceId: string, userId: string): Promise<boolean>{
        const deleted = await SessionModelMongoose
            .deleteOne({$and:[{deviceId: deviceId},{userId: userId}]})
        return !!deleted.deletedCount
    }

    static async getSessionByDevicesId(deviceId: string): Promise<WithId<devicesDBType>|null>{
        return await SessionModelMongoose
            .findOne({deviceId: deviceId})
    }

    static async getSessionsByDeviceIdAndUserId(deviceId: string, userId: string): Promise<WithId<devicesDBType>|null>{
        return await SessionModelMongoose
            .findOne({$and:[{deviceId: deviceId},{userId: userId}]})
    }

}