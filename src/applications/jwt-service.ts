import jwt from 'jsonwebtoken'
import {ACCESS_LIFETIME, JWT_SECRET, REFRESH_LIFETIME, REFRESH_SECRET} from "../settings";
import {accessTokenModel, tokensModel} from "../types/users/auth.login.models";
import {refreshPayloadType} from "../types/tokens/token.models";
import {SecurityRepository} from "../repositories/security_db_repository";


export const jwtMapper = (token: string): accessTokenModel=>{
        return {
            accessToken: token
        }
    }

export const jwtService = {

    async createAccessToken (id: string, secret: string, lifetime: string): Promise<string|null>{
        try{
            const token = jwt.sign({userId: id}, secret, {expiresIn:lifetime})
            return  token
        }catch (e) {
            return null
        }
    },

    async createRefreshToken (id: string, deviceId:string, secret: string, lifetime: string): Promise<string|null>{
        try{
            const token = jwt.sign({userId: id, deviceId: deviceId}, secret, {expiresIn:lifetime})
            return  token
        }catch (e) {
            return null
        }
    },

    async verifyTokenGetUserId(token: string, secret: string): Promise<string|null>{
        try {
            const result:any  = jwt.verify(token, secret)
            return result.userId
        }catch (error) {
            return null
        }
    },

    async verifyRefreshToken(token: string, secret: string): Promise<refreshPayloadType|null>{
        try {
            const result:any  = jwt.verify(token, secret)
            return {userId: result.userId,
                    deviceId: result.deviceId,
                    expiresAt: result.exp,
                    issuedAt: result.iat}
        }catch (error) {
            return null
        }
    },

    async decodeRefreshToken(token: string): Promise<refreshPayloadType|null>{
        try {
            const decodedToken:any  = jwt.decode(token)
            return {userId: decodedToken.userId,
                deviceId: decodedToken.deviceId,
                expiresAt: decodedToken.exp,
                issuedAt: decodedToken.iat}
        }catch (error) {
            return null
        }
    },

    async createAccessAndRefreshTokens(id: string, deviceId: string):Promise<tokensModel|null>{
        const accessToken = await this.createAccessToken(id, JWT_SECRET, ACCESS_LIFETIME)
        const refreshToken = await this.createRefreshToken(id, deviceId, REFRESH_SECRET, REFRESH_LIFETIME)

        if(accessToken && refreshToken){

            const decoded = await this.decodeRefreshToken(refreshToken)
            if (!decoded) return null
            await SecurityRepository.updateSessionWithNewRefreshToken(decoded)

            const jwtToken = jwtMapper(accessToken)
            return  {
                accessToken: jwtToken,
                refreshToken: refreshToken
            }
        } else return null
    },

    async revokeToken(token:string, id: string, secret: string):Promise<string|null>{
        try{
            //const token = jwt.sign({userId: id}, secret, {expiresIn:0})
            return  token
        }catch (e) {
            return null
        }

    }
}
