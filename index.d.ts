//index.d.ts
import {UserModel} from "./src/types/users/output.users.model";

declare global {
    namespace Express {
        export interface Request {
            user: UserModel | null
        }
    }
}