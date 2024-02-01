import {emailAdapter} from "../adapters/email-adapter";
import {outputData} from "../types/common";
import {authService} from "../services/auth-service";
import {UserQueryRepository} from "../query-repositories/user_query_repository";

export const emailManager = {

    async sendConfirmationCode(email: string, code: string):Promise<outputData>{

        const isSentEmail = await emailAdapter.sendEmail(email, code)

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
    },

    async ResendConfirmationCode(email: string):Promise<outputData>{
        const result = await authService.checkUserIsNotConfirmed(email)

        if(result.status !== 204) {
            return {
                status: 400,
                data: result.data
            }
        }

        const emailConfirmation = await UserQueryRepository.getConfirmationInfo(email)

        if (!emailConfirmation) {
            return {
                status: 400,
                data: ' '
            }
        }

        const isSentEmail = await emailAdapter.sendEmail(email, emailConfirmation.confirmationCode)

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
    }
}