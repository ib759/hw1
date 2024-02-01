import {Router, Request, Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/common";
import {CreateUserModel} from "../types/users/input.users.model";
import {authMiddleware} from "../middlewares/authorization/authBasicMiddleware";
import {QueryUserInputModel} from "../types/users/query.user.input.model";
import {ObjectId} from "mongodb";
import {userValidation} from "../validators/user-validator";
import {usersService} from "../services/user-service";
import {UserQueryRepository} from "../query-repositories/user_query_repository";

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

    const users = await UserQueryRepository.getAllUsers(sortData)

    res.status(200).send(users)
})

userRoute.post('/', authMiddleware, userValidation(), async (req: RequestWithBody<CreateUserModel>, res: Response) => {
    let {login, password, email} = req.body
    const admin = true //user is created by admin

    const newUser = await usersService.createUser({login, password, email}, admin)

    switch (newUser.status) {
        case 400:
            res.status(400).send(newUser.data)
            break;
        case 204:
            res.status(201).send(newUser.data)
            break;
    }
})

userRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<{id: string}>, res: Response) => {
    const userId = req.params.id

    if (!ObjectId.isValid(userId)){
        res.sendStatus(404)
        return
    }

    const deletedUserFlag = await usersService.deleteUserById(userId)

    if (!deletedUserFlag) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})
