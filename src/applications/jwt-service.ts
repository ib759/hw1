import jwt from 'jsonwebtoken'
import {JWT_SECRET} from "../settings";
import {UserQueryRepository} from "../query-repositories/user_query_repository";


export const jwtMapper = (token: string) =>{
        return{
            accessToken: token
        }
    }

export const jwtService = {

    async createJWT (loginOrEmail:string): Promise<object|null>{
        const user = await UserQueryRepository.getUserWithPassword(loginOrEmail)

        if (!user){
            return null
        }
        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn:'1h'})
        const jwtToken = jwtMapper(token)
        return  jwtToken
    },

    async getUserIdByToken(token: string): Promise<object|null>{

        try {
            const result:any  = jwt.verify(token, JWT_SECRET)
            return result.userId//new ObjectId(result.userId)
        }catch (error) {
            return null
        }
    }

}
