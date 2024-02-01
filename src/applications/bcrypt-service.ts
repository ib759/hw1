import bcrypt from "bcryptjs";

export const bcryptService = {
    async createHash(password: string): Promise<string>{
        const passwordSalt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, passwordSalt)
        return hash
    },

    async passwordValidation(passwordFromUser:string, passwordFromDB: string): Promise<boolean>{
        const valid = await bcrypt.compare(passwordFromUser, passwordFromDB)
        return valid
    }
}