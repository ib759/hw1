import {tokenCollection, TokenModelMongoose} from "../../db/db";
import {tokenDBType} from "../types/db/db";
import {WithId} from "mongodb";

export class TokenRepository {

    static async addTokenToBlacklist(refreshToken: tokenDBType): Promise<string|undefined>{
        const token = await TokenModelMongoose.insertMany([refreshToken])
        return token[0]._id.toString()
    }

    static async getToken(refreshToken: string, userId: string):Promise<WithId<tokenDBType>|null>{
        //const token = await tokenCollection.findOne({$and: [{refreshToken: refreshToken},{userid: userId}]})
        const token = await TokenModelMongoose.findOne({refreshToken: refreshToken})

        if (!token) return null
        return token
    }
}