import {UserDbType} from "../../db/db";
import {WithId} from "mongodb";
import {UserModel} from "../output.users.model";

export const userMapper = (userDb: WithId<UserDbType>): UserModel =>{
    return{
        id: userDb._id.toString(),
        login: userDb.login,
        email: userDb.email,
        createdAt: userDb.createdAt,
    }
}