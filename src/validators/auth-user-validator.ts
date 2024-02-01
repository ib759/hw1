import {body} from "express-validator";
import {inputValidation} from "../middlewares/input-model-validation/input-validation";

export const LoginOrEmailValidator = body('loginOrEmail').isString().trim()
//    .matches('^[a-zA-Z0-9_-]*$').withMessage('Incorrect login!')
export const passwordValidator = body('password').isString().trim()
export const emailResendingValidator = body('email').isString().trim()
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
export const confirmationCodeValidator = body('code').isString().trim()

export const userInfoForLoginValidation = () => [LoginOrEmailValidator, passwordValidator, inputValidation]
export const emailResendingValidation = () => [emailResendingValidator, inputValidation]
export const confirmationCodeValidation = () => [confirmationCodeValidator, inputValidation]