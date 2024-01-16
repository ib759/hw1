import {NextFunction, Request, Response} from "express";

import dotenv from 'dotenv'
dotenv.config()

export const authMiddleware = (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
    /*if(req.headers['authorization'] !== 'Basic YWRtaW46cXdlcnR5'){
        res.sendStatus(401)
        return
    }
    next()*/

    //OR

    const auth = req.headers['authorization']
    if (!auth){
        res.sendStatus(401)
        //res.send('1111')
        return
    }
    const [basic, token] = auth.split(" ")
    if(basic !== 'Basic'){
        res.sendStatus(401)
        //res.send('2222')
        return
    }
    const decodedData = Buffer.from(token, 'base64').toString()

    // admin:qwerty

    const [login, password] = decodedData.split(":")
    //if(login !== 'admin' || password !== 'qwerty'){
    if(login !== process.env["AUTH_LOGIN"] || password !== process.env["AUTH_PASSWORD"]){

        res.sendStatus(401)
        //res.send('3333')
        return
    }

    return next()
    //res.send('4444')
}