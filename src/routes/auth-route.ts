import {Router, Request, Response} from "express";
import {RequestWithBody} from "../types/common";
import {authLoginModels} from "../types/users/auth.login.models";
import {
    confirmationCodeValidation,
    emailResendingValidation,
    userInfoForLoginValidation
} from "../validators/auth-user-validator";
import {usersService} from "../services/user-service";
import {authBearerMiddleware} from "../middlewares/authorization/authBearerMiddleware";
import {CreateUserModel} from "../types/users/input.users.model";
import {userValidation} from "../validators/user-validator";
import {EmailResendingModel, InputConfirmationModel} from "../types/users/email.confirmation.models";
import {authService} from "../services/auth-service";
import {emailManager} from "../managers/email-manager";
import {REFRESH_SECRET} from "../settings";


export const authRoute = Router({})

authRoute.post('/login', userInfoForLoginValidation(), async (req: RequestWithBody<authLoginModels>, res: Response) => {
    let {loginOrEmail, password} = req.body

    const valid= await usersService.checkCredentials(loginOrEmail, password)//false if login or email or password wrong or user not exists

    if(valid){
        const tokens = await authService.userLogin(loginOrEmail)
        if(tokens){
            res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true })
            res.status(200).send(tokens.accessToken)
            return
        }
    }
    res.sendStatus(401)

})

authRoute.get('/me', authBearerMiddleware, async(req:Request, res:Response) =>{

    /*if(!req.user){
        res.sendStatus(401)
        return
    }*/

    const userReq = req.user!
    const user = await usersService.findCurrentUser(userReq)
    res.status(200).send(user)

})

authRoute.post('/registration', userValidation(), async (req: RequestWithBody<CreateUserModel>, res: Response) =>{

    let {login, password, email} = req.body

    const registrationInfo = await authService.userRegistration({login, password, email})

    switch (registrationInfo.status) {
        case 400:
            res.status(400).send(registrationInfo.data)
            break;
        case 204:
            res.sendStatus(204)
            break;
        default:
            res.sendStatus(400)
            break;
    }
})

authRoute.post('/registration-confirmation', confirmationCodeValidation(), async (req: RequestWithBody<InputConfirmationModel>, res: Response) =>{

    const confirmationInfo = req.body

    const isConfirmed = await authService.confirmEmail(confirmationInfo.code)

    switch(isConfirmed.status){
        case 1:
            res.status(400).send(isConfirmed.data)
            break;
        case 2:
            res.sendStatus(204)
            break;
        default:
            res.sendStatus(400)
            break;
    }
})

authRoute.post('/registration-email-resending', emailResendingValidation(), async (req: RequestWithBody<EmailResendingModel>, res: Response) =>{

    const resendingInfo = req.body

    const isCodeResent = await emailManager.ResendConfirmationCode(resendingInfo.email)

    switch(isCodeResent.status){
        case 400:
            res.status(400).send(isCodeResent.data)
            break;
        case 204:
            res.sendStatus(204)
            break;
        default:
            res.sendStatus(400)
            break;
    }

})

authRoute.post('/refresh-token', async(req: Request, res: Response) =>{
    if (!req.cookies['refreshToken']) {
           res.sendStatus(401)
            return
    }

    const refreshToken = req.cookies['refreshToken']
    const tokens  = await authService.updateAccessAndRefreshTokens(refreshToken, REFRESH_SECRET)

    if(tokens){
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true })
        res.status(200).send(tokens.accessToken)
        return
    }

    res.sendStatus(401)
})

authRoute.post('/logout', async(req: Request, res: Response) =>{
    if (!req.cookies['refreshToken']) {
        res.sendStatus(401)
        return
    }

    const refreshToken = req.cookies['refreshToken']

    const isRevoked = await authService.userLogout(refreshToken)

    if(isRevoked){
        res.cookie('refreshToken', isRevoked, { httpOnly: true, secure: true })
        res.sendStatus(204)
        return
    }
    res.sendStatus(401)
})


