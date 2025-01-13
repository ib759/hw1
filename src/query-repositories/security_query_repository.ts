import {sessionCollection, SessionModelMongoose} from "../../db/db";
import {sessionMapper} from "../types/security/mappers/session-mapper";
import {outputSessionModel} from "../types/security/output.session.models";

export class SecurityQueryRepository {
    static async getAllSessionsForUser(userId: string): Promise<outputSessionModel[]>{
        const sessions = await SessionModelMongoose
            .find({$and: [{userId: userId}, {expiredDate: {$gt: Math.floor(Date.now()/1000)}}]})
            .lean()
        //console.log(Math.floor(Date.now()/1000))
        //const sessions = await sessionCollection.find({userId: userId}).toArray()
            return sessions.map(sessionMapper)
    }
}