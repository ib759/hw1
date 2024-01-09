import {Router, Request, Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/common";
import {CreateUserModel} from "../types/users/input.users.model";
import {authMiddleware} from "../middlewares/auth/auth_middleware";
import {QueryUserInputModel} from "../types/users/query.user.input.model";
import {UserRepository} from "../repositories/user_db_repository";
import {ObjectId} from "mongodb";
import {userValidation} from "../validators/user-validator";
import bcrypt from 'bcryptjs'

export const userRoute = Router({})

userRoute.get('/', authMiddleware, async (req: RequestWithQuery<QueryUserInputModel>, res: Response) => {
    const sortData: QueryUserInputModel = {
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        searchLoginTerm: req.query.searchLoginTerm,
        searchEmailTerm: req.query.searchEmailTerm
    }

    const users = await UserRepository.getAllUsers(sortData)

    res.status(200).send(users)
})

userRoute.post('/', authMiddleware, userValidation(), async (req: RequestWithBody<CreateUserModel>, res: Response) => {

    let login = req.body.login
    let passFromUser = req.body.password
    let email = req.body.email

    const passwordSalt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(passFromUser, passwordSalt)

    const newUser = await UserRepository.createUser({login, password, email})
    if (!newUser) {
        res.sendStatus(400)
        return
    }
    const checkInsertion = await UserRepository.getUserById(newUser.id)
    if (!checkInsertion) {
        res.sendStatus(400)
        return
    }
    res.status(201).send(checkInsertion)
})

userRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<{id: string}>, res: Response) => {
    const userId = req.params.id

    if (!ObjectId.isValid(userId)){
        res.sendStatus(404)
        return
    }

    const deletedUserFlag = await UserRepository.deleteUserById(userId)

    if (!deletedUserFlag) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})
