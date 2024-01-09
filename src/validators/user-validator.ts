import {body} from "express-validator";
import {inputValidation} from "../middlewares/input-model-validation/input-validation";
import {Request} from "express";

export const loginValidator = body('login').isString().trim().isLength({min:3,max:10}).withMessage('Incorrect login!')
    .matches('^[a-zA-Z0-9_-]*$').withMessage('Incorrect login!')
export const passwordValidator = body('password').isString().trim().isLength({min:6, max:20}).withMessage('Incorrect password!')
export const emailValidator = body('email').isString().trim()
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Incorrect email!')

export const userValidation = () => [loginValidator, passwordValidator, emailValidator, inputValidation]
