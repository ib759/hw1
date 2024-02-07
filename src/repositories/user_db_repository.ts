import {userCollection} from "../../db/db";
import {ObjectId, WithId} from "mongodb";
import {ConfirmationInfoDBType, UserDbType} from "../types/db/db";
import {UserModel} from "../types/users/output.users.model";
import {userMapper} from "../types/users/mappers/user-mapper";

export class UserRepository {

    static async getUserById(id:string): Promise<UserModel | null>{
        const user = await userCollection.findOne({_id: new ObjectId(id)})
        if(!user){
            return null
        }
        return userMapper(user)
    }

    static async getConfirmationInfo(email: string):Promise<{confirmationCode: string, expirationDate: string, isConfirmed: boolean}|null>{
        const info = await userCollection.findOne({email: email})
        if(!info){
            return null
        }
        return info.emailConfirmation
    }

    static async getUserByConfirmationCode(code:string):Promise<WithId<UserDbType>|null>{
        const user = await userCollection.findOne({"emailConfirmation.confirmationCode": code})//{emailConfirmation: {confirmationCode: code}}
        if(!user) return null
        return user
    }

    static async getUserWithPassword(loginOrEmail:string): Promise<WithId<UserDbType>| null>{
        const user  = await userCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
        if(!user){
            return null
        }
        return user
    }

    static async getUserByLogin(login: string): Promise<UserModel| null>{
        const user  = await userCollection.findOne({login: login})
        if(!user){
            return null
        }
        return userMapper(user)
    }

    static async getUserByEmail(email: string): Promise<UserModel| null>{
        const user  = await userCollection.findOne({email: email})
        if(!user){
            return null
        }
        return userMapper(user)
    }

    static async addUser(newUser: UserDbType): Promise<UserModel|undefined>{
        const user = await userCollection.insertOne(newUser)

        return {
            ...newUser,
            id: user.insertedId.toString()
        }
    }

    static async deleteUserById(id:string): Promise<boolean> {
        const user = await userCollection.deleteOne({_id: new ObjectId(id)})
        return !!user.deletedCount;
    }

    static async deleteUserByEmail(email:string): Promise<boolean> {
        const user = await userCollection.deleteOne({email: email})
        return !!user.deletedCount;
    }

    static async updateUserConfirmation(id: string): Promise<boolean>{
        const user = await userCollection.updateOne({_id: new ObjectId(id)},
            {$set: {'emailConfirmation.isConfirmed': true}})

        return !!user.matchedCount
    }

    static async updateConfirmationInfo(id:string, emailConfirmation: ConfirmationInfoDBType): Promise<boolean>{
        const user = await userCollection.updateOne({_id: new ObjectId(id)},
            {$set: { 'emailConfirmation.confirmationCode': emailConfirmation.confirmationCode,
                            'emailConfirmation.expirationDate': emailConfirmation.expirationDate,
                            'emailConfirmation.isConfirmed': emailConfirmation.isConfirmed }})
        return !!user.matchedCount
    }
}