import {userCollection} from "../../db/db";
import {ObjectId, WithId} from "mongodb";
import {UserDbType} from "../types/db/db";
import {UserModel} from "../types/users/output.users.model";

export class UserRepository {

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
}