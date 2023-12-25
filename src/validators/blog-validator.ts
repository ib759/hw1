import {body} from "express-validator";
import {inputValidation} from "../middlewares/input-model-validation/input-validation";

export const nameValidator = body('name').isString().trim().isLength({min:1, max:15}).withMessage('Incorrect name!')

export const descriptionValidator = body('description').isString().trim().isLength({min:1, max:500}).withMessage('Incorrect description!')

export const websiteUrlValidator = body('websiteUrl').isString().trim()
    .isLength({min:1, max:100}).withMessage('Incorrect websiteUrl!')
    .matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$').withMessage('Incorrect websiteUrl!')
    //^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$

export const blogValidation = () => [nameValidator, descriptionValidator, websiteUrlValidator, inputValidation]