import jwt from 'jsonwebtoken'
import {ACCESS_LIFETIME, JWT_SECRET, REFRESH_LIFETIME, REFRESH_SECRET} from "../settings";
import {accessTokenModel, tokensModel} from "../types/users/auth.login.models";


export const jwtMapper = (token: string): accessTokenModel=>{
        return {
            accessToken: token
        }
    }

export const jwtService = {

    async createJWT (id: string, secret: string, lifetime: string): Promise<string|null>{
        try{
            const token = jwt.sign({userId: id}, secret, {expiresIn:lifetime})
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

    async createAccessAndRefreshTokens(id: string):Promise<tokensModel|null>{
        const accessToken = await this.createJWT(id, JWT_SECRET, ACCESS_LIFETIME)
        const refreshToken = await this.createJWT(id, REFRESH_SECRET, REFRESH_LIFETIME)

        if(accessToken && refreshToken){
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
