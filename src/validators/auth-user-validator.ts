import {body} from "express-validator";
import {inputValidation} from "../middlewares/input-model-validation/input-validation";

export const loginValidator = body('loginOrEmail').isString().trim()
    .matches('^[a-zA-Z0-9_-]*$').withMessage('Incorrect login!')
export const passwordValidator = body('password').isString().trim()

export const userAuthValidation = () => [loginValidator, passwordValidator, inputValidation]