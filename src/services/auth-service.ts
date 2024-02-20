import {ErrorType, outputData} from "../types/common";
import {UserRepository} from "../repositories/user_db_repository";
import {CreateUserModel} from "../types/users/input.users.model";
import {emailManager} from "../managers/email-manager";
import {usersService} from "./user-service";
import {userMapper} from "../types/users/mappers/user-mapper";
import {v4 as uuidv4} from "uuid";
import {addHours} from "date-fns";
import {ConfirmationInfoDBType} from "../types/db/db";
import {tokensModel} from "../types/users/auth.login.models";
import {jwtService} from "../applications/jwt-service";
import {TokenRepository} from "../repositories/token_db_repository";
import {REFRESH_SECRET} from "../settings";
import {securityService} from "./security-service";
import {SecurityRepository} from "../repositories/security_db_repository";

export const authService = {

    async userLogin(loginOrEmail:string, ipUser: string, title: string):Promise<tokensModel|null>{
        const user = await UserRepository.getUserWithPassword(loginOrEmail)
        if (!user){
            return null
        }

        const deviceId = uuidv4()
        const tokens = await jwtService.createAccessAndRefreshTokens(user._id.toString(), deviceId)

        if (!tokens) return null

        const decodedToken = await jwtService.decodeRefreshToken(tokens.refreshToken)

        if (decodedToken){

            const added = await securityService.addSessionToTheList(decodedToken, ipUser, title)
        }

        return tokens
    },

    async userLogout(token: string):Promise<boolean|null>{
        const payloadRefreshToken = await jwtService.verifyRefreshToken(token, REFRESH_SECRET)
        if (!payloadRefreshToken){
            return null
        }
        const isInBlacklist = await TokenRepository.getToken(token, payloadRefreshToken.userId)

        if(isInBlacklist) return null
        await TokenRepository.addTokenToBlacklist({refreshToken: token, userId: payloadRefreshToken.userId})

        const isDeleted = await SecurityRepository.deleteCurrentSessionForLogout(payloadRefreshToken.deviceId, payloadRefreshToken.userId)
        return isDeleted
    },

    async updateAccessAndRefreshTokens(token:string):Promise<tokensModel|null>{
        //const userId = await jwtService.verifyTokenGetUserId(token, secret)
        const payloadRefreshToken = await jwtService.verifyRefreshToken(token, REFRESH_SECRET)
        if (!payloadRefreshToken){
            return null
        }

        const isInBlacklist = await TokenRepository.getToken(token, payloadRefreshToken.userId)

        if(isInBlacklist) return null

        await TokenRepository.addTokenToBlacklist({refreshToken: token, userId: payloadRefreshToken.userId})

        const tokens = await jwtService.createAccessAndRefreshTokens(payloadRefreshToken.userId, payloadRefreshToken.deviceId)
        return tokens
    },

    async userRegistration(user:CreateUserModel):Promise<outputData>{
        const admin  = false
        const newUser = await usersService.createUser(user, admin)

        if(newUser.status === 400) {
            return {
                status: 400,
                data: newUser.data
            }
        }

        const emailConfirmation = await UserRepository.getConfirmationInfo(user.email)

        if (!emailConfirmation){
            return {
                status: 400,
                data: ' '
            }
        }

        let errors: ErrorType = {
            errorsMessages: []
        }

          const result = await emailManager.sendConfirmationCode(user.email, emailConfirmation.confirmationCode)

        if (result.status === 400){
            errors.errorsMessages.push({message: result.data.toString(), field: 'email'})
            await UserRepository.deleteUserByEmail(user.email)
            return {
                status: 400,
                data: errors
            }
        }

        return {
            status: 204,
            data: ' '
        }
    },

    async checkExistingEmailOrLogin(email: string, login: string):Promise<ErrorType|null>{
        let errors: ErrorType = {
            errorsMessages: []
        }

        const userByLogin = await UserRepository.getUserByLogin(login)
        if (userByLogin){
            errors.errorsMessages.push({message: 'User with this login already exists!', field: 'login'})
            return errors
        }

        const userByEmail = await UserRepository.getUserByEmail(email)
        if (userByEmail){
            errors.errorsMessages.push({message: 'User with this email already exists!', field: 'email'})
            return errors
        }

        return null
    },

    async confirmEmail(code: string):Promise<outputData>{
        let errors: ErrorType = {
            errorsMessages: []
        }

        const user = await UserRepository.getUserByConfirmationCode(code)

        if(!user) {
            errors.errorsMessages.push({message: 'User is not found!', field: 'code'})
            return {
                status:1,
                data:errors
            }}
        if(user.emailConfirmation.isConfirmed) {
            errors.errorsMessages.push({message: 'User is already confirmed!', field: 'code'})
            return {
                status:1,
                data:errors
            }}

        if(user.emailConfirmation.confirmationCode !== code) {
            errors.errorsMessages.push({message: 'ConfirmationCode is incorrect!', field: 'code'})
            return {
                status:1,
                data:errors
            }}

        if(user.emailConfirmation.expirationDate < new Date().toISOString()) {
            errors.errorsMessages.push({message: 'Confirmation code is expired!', field: 'code'})
            return {
                status:1,
                data:errors
            }}
        try{
            await UserRepository.updateUserConfirmation(user._id.toString())
        }
        catch (error: any) {
            errors.errorsMessages.push({message: error, field: 'code'})
            return{
                status:1,
                data:errors
            }
        }

        return {
            status:2,
            data:' '
        }
    },

    async checkUserIsNotConfirmed(email: string):Promise<outputData>{
        let errors: ErrorType = {
            errorsMessages: []
        }

        const user = await UserRepository.getUserWithPassword(email)

        if(!user) {
            errors.errorsMessages.push({message: 'User is not found!', field: 'email'})
            return {
                status: 400,
                data: errors
            }
        }

        if (user.emailConfirmation.isConfirmed) {
            errors.errorsMessages.push({message: 'User is already confirmed!', field: 'email'})
            return {
                status: 400,
                data: errors
            }
        }

        return {
            status: 204,
            data: userMapper(user)
        }
    },
    async updatedConfirmationCode(email: string):Promise<outputData> {
        let errors: ErrorType = {
            errorsMessages: []
        }

        const user = await UserRepository.getUserWithPassword(email)

        if(!user) {
            errors.errorsMessages.push({message: 'User is not found!', field: 'email'})
            return {
                status: 400,
                data: errors
            }
        }

        const info: ConfirmationInfoDBType = {
            confirmationCode: uuidv4(),
            expirationDate: addHours(new Date(), 5).toISOString(),
            isConfirmed: false
        }

        const isUpdated = await UserRepository.updateConfirmationInfo(user._id.toString(), info)

        if(!isUpdated) {
            errors.errorsMessages.push({message: 'Code is not updated!', field: 'email'})
            return {
                status: 400,
                data: errors
            }
        }

        return {
            status: 204,
            data: info.confirmationCode
        }

    }
}