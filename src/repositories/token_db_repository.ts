import {tokenCollection} from "../../db/db";
import {tokenDBType} from "../types/db/db";
import {WithId} from "mongodb";

export class TokenRepository {

    static async addTokenToBlacklist(refreshToken: tokenDBType): Promise<string|undefined>{
        const token = await tokenCollection.insertOne(refreshToken)
        return token.insertedId.toString()
    }

    static async getToken(refreshToken: string, userId: string):Promise<WithId<tokenDBType>|null>{
        const token = await tokenCollection.findOne({$and: [{refreshToken: refreshToken},{userid: userId}]})
        if (!token) return null
        return token
    }
}