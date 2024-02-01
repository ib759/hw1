import nodemailer from "nodemailer";
import {outputData} from "../types/common";

export const emailAdapter ={
    async sendEmail(email: string, code: string):Promise<outputData>{
        const from = '"Registration" <ib759759759@gmail.com>'
        const subject = "Registration confirmation"
        const text = "Registration"
        const html = `<h1>Thank for your registration</h1>
                        <p>To finish registration please follow the link below:
                            <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
                        </p>`

        let transporter = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            auth: {
                user: 'ib759759759@gmail.com',
                pass: 'jrbu wuxw tttm bvzr'     //B7sSRB7HkkxHWMvaHZBf
            },
        })

        try{
            const info = await transporter.sendMail({
                from: from,
                to: email,
                subject: subject, // Subject line
                text: text, // plain text body
                html: html,
            })
            return {
                status: 1, //email is sent
                data:info.messageId
            }
        }catch (error: any) {
            return {
                status: 2, //errors in email sending,
                data: error.message ?? 'EmailSending is failed'
            }
        }
}}