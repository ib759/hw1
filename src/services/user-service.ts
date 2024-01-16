import {UserRepository} from "../repositories/user_db_repository";
import bcrypt from "bcryptjs";
import {CurrentUserOutput, UserModel} from "../types/users/output.users.model";
import {userMapper} from "../types/users/mappers/user-mapper";

export const usersService = {

    async checkCredentials(loginOrEmail:string, password:string): Promise<boolean>{
        const user = await UserRepository.getUserByLoginOrEmail(loginOrEmail)

        if (!user) {
            return false
        }
        const valid = await bcrypt.compare(password, user.password)
        return valid
    },

    async getUserWithoutPassword(loginOrEmail:string): Promise<UserModel | null>{
        const user = await UserRepository.getUserByLoginOrEmail(loginOrEmail)
        if (!user){
            return null
        }
        return userMapper(user)
    },
     async findUserById(userId: string): Promise<UserModel | null>{
         const user = await UserRepository.getUserById(userId)
         if (!user){
             return null
         }
         return user
     },
    async getCurrentUser(user: UserModel): Promise<CurrentUserOutput>{
            return{
                email: user.email,
                login: user.login,
                userId: user.id
            }
    }
}

