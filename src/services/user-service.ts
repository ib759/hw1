import {UserRepository} from "../repositories/user_db_repository";
import {CurrentUserOutput, UserModel} from "../types/users/output.users.model";
import {outputData} from "../types/common";
import {UserQueryRepository} from "../query-repositories/user_query_repository";
import {CreateUserModel} from "../types/users/input.users.model";
import {bcryptService} from "../applications/bcrypt-service";
import {authService} from "./auth-service";
import {UserDbType} from "../types/db/db";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/fp";
import {emailManager} from "../managers/email-manager";
import {addHours} from "date-fns";

export const usersService = {

    async checkCredentials(loginOrEmail:string, password:string): Promise<boolean>{
        const user = await UserQueryRepository.getUserWithPassword(loginOrEmail)

        if (!user) {
            return false
        }
        const valid = await bcryptService.passwordValidation(password, user.password)
        return valid
    },

    async createUser(createdUser: CreateUserModel, admin: boolean): Promise<outputData>{

        const checkOverlapping = await authService.checkExistingEmailOrLogin(createdUser.email, createdUser.login)
        if(checkOverlapping) {
            return{
               status: 400,
               data: checkOverlapping
            }
        }

        const hash = await bcryptService.createHash(createdUser.password)

        let confirmed = false
        if (admin) {
            confirmed = true
        }
        const createdAt = new Date()

        const newUser: UserDbType = {
            login: createdUser.login,
            password: hash,
            email: createdUser.email,
            createdAt: createdAt.toISOString(),
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: addHours(new Date(), 5).toISOString(),
                isConfirmed: confirmed
            }
        }

        const user = await UserRepository.addUser(newUser)
        if (!user) {
            return {
                status: 400,////swagger without 404
                data: ' '
            }
        }

        const checkInsertion = await UserQueryRepository.getUserById(user.id)
        if (!checkInsertion) {
            return {
                status: 400,////swagger without 404
                data: ' '
            }
        }else{
            return {
                status: 204,
                data: checkInsertion
            }
        }
    },

    async findCurrentUser(user: UserModel): Promise<CurrentUserOutput>{
            return{
                email: user.email,
                login: user.login,
                userId: user.id
            }
    },

    async deleteUserById(id: string): Promise<boolean>{
        return await UserRepository.deleteUserById(id)
    }
}

