import {body} from 'express-validator'
import {inputValidation} from "../middlewares/input-model-validation/input-validation";

export const contentValidator = body('content')
    .isString()
    .trim()
    .isLength({min:20,max:300})
    .withMessage('Incorrect content!')


export const updateCommentValidator = () =>[contentValidator, inputValidation]
export const createCommentValidator = () =>[contentValidator, inputValidation]