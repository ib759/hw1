import {devicesDBType} from "../types/db/db";
import {sessionCollection} from "../../db/db";
import {ObjectId, WithId} from "mongodb";
import {refreshPayloadType} from "../types/tokens/token.models";

export class SecurityRepository {

    static async addSession(sessionDB: devicesDBType):Promise<string|null>{
        try{
            const session = await sessionCollection.insertOne(sessionDB)
            return session.insertedId.toString()
        }catch (e) {
            return null
        }
    }

    static async updateSessionWithNewRefreshToken(decoded: refreshPayloadType):Promise<boolean>{
        try{
            const isUpdated = await sessionCollection
                .updateOne({$and:[{userId: decoded.userId}, {deviceId: decoded.deviceId}]},
                    {$set: {'issuedDate': decoded.issuedAt,
                                    'expiredDate': decoded.expiresAt,
                                    'lastActiveDate': decoded.issuedAt.toString()
                                    }})
            return !!isUpdated.matchedCount
        }catch (e) {
            return false
        }
    }

    static async deleteSession(sessionId: string): Promise<boolean>{
        const deleted = await sessionCollection.deleteOne({_id: new ObjectId(sessionId)})
        return !!deleted.deletedCount
    }

    static async deleteSessionsWithoutCurrent(deviceId: string, userId: string): Promise<boolean>{
        const deleted = await sessionCollection.deleteMany({$or:[{deviceId: {$ne: deviceId}},{userId: {$ne:userId}}]})
        return !!deleted.deletedCount

    }

    static async deleteCurrentSessionForLogout(deviceId: string, userId: string): Promise<boolean>{
        const deleted = await sessionCollection.deleteOne({$and:[{deviceId: deviceId},{userId: userId}]})
        return !!deleted.deletedCount
    }

    static async getSessionByDevicesId(deviceId: string): Promise<WithId<devicesDBType>|null>{

        return await sessionCollection.findOne({deviceId: deviceId})
    }

}