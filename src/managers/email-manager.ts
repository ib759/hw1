import {emailAdapter} from "../adapters/email-adapter";
import {outputData} from "../types/common";
import {authService} from "../services/auth-service";
import {UserQueryRepository} from "../query-repositories/user_query_repository";
import {UserRepository} from "../repositories/user_db_repository";

export const emailManager = {

    async sendRecoveryPasswordCode(email: string):Promise<outputData>{

        const emailConfirmation = await UserRepository.getConfirmationInfo(email)

        if (!emailConfirmation) {
            return {
                status: 400,
                data: 'User with this email does not exist'
            }
        }

        const code = emailConfirmation.confirmationCode
        const html = `<h1>Password recovery</h1>
                        <p>To finish password recovery please follow the link below:
                            <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
                        </p>`
        const subject = "Password recovery"
        emailAdapter.sendEmail(email, code, html, subject)

        return {
            status: 204,
            data: ' '
        }


    },

    async sendConfirmationCode(email: string, code: string):Promise<outputData>{

        const html = `<h1>Thank for your registration</h1>
                        <p>To finish registration please follow the link below:
                            <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
                        </p>`
        const subject = "Registration confirmation"
        const isSentEmail =  emailAdapter.sendEmail(email, code, html, subject)

        return {
            status: 204,
            data: ' '
        }

        /*
        if (isSentEmail.status === 1){
            return {
                status: 204,
                data: ' '
            }
        }
        if (isSentEmail.status === 2){
            return {
                status: 400,
                data: isSentEmail.data ?? 'EmailSending is failed'
            }
        }

        return {
            status: 400,
            data: 'Email sending is failed '
        }
        */
    },

    async ResendConfirmationCode(email: string):Promise<outputData>{
        const result = await authService.checkUserIsNotConfirmed(email)

        if(result.status != 204) {
            return {
                status: 400,
                data: result.data
            }
        }

        const updatedInfo = await authService.updatedConfirmationCode(email)
        let confirmationCode: string = ''

        if(updatedInfo.status != 204){
            return {
                status: 400,
                data: result.data
            }
        }

        if(typeof updatedInfo.data === 'string') confirmationCode = updatedInfo.data

        const html = `<h1>Thank for your registration</h1>
                        <p>To finish registration please follow the link below:
                            <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
                        </p>`
        const subject = "Registration confirmation"

        emailAdapter.sendEmail(email, confirmationCode, html, subject)

        /*if (isSentEmail.status === 1){
                    return {
                        status: 204,
                        data: ' '
                    }
        }
        if (isSentEmail.status === 2){
                    return {
                        status: 400,
                        data: isSentEmail.data ?? 'EmailSending is failed'
                    }
        }*/
        return {
            status: 204,
            data: ' '
        }
    }
}