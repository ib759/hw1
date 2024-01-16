
import jwt from 'jsonwebtoken'
import {ObjectId, WithId} from "mongodb";
import {JWT_SECRET} from "../settings";
import {UserModel} from "../types/users/output.users.model";

export const jwtService = {

    async createJWT (user: UserModel){

        const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn:'1h'})
        return token
    },

    async getUserIdByToken(token: string){

        try {
            const result = jwt.verify(token, JWT_SECRET)
            return new ObjectId(result.userId)
        }catch (error) {
            return null
        }
    }

}

export const jwtMapper = (token: string) =>{
    return{
        accessToken: token
    }
}