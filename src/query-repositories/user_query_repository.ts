import {QueryUserInputModel} from "../types/users/query.user.input.model";
import {QueryUserOutputModel} from "../types/users/query.user.output.model";
import {userCollection} from "../../db/db";
import {userMapper} from "../types/users/mappers/user-mapper";
import {UserModel} from "../types/users/output.users.model";

export class UserQueryRepository {
    static async getAllUsers(sortData: QueryUserInputModel): Promise<QueryUserOutputModel>{

        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10
        const searchLoginTerm =  sortData.searchLoginTerm ?? null
        const searchEmailTerm = sortData.searchEmailTerm ?? null

        let filter = {}
        let filterLogin = {}
        let filterEmail = {}
        let LengthFlag = false

        if(searchLoginTerm){
            filterLogin = {
                login: {$regex: searchLoginTerm, $options:'i'}
            }
        }else {filterLogin = {login: null}}

        if(searchEmailTerm){
            filterEmail = {
                email: {$regex: searchEmailTerm, $options:'i'}
            }
        }else {filterEmail = {email: null}}

        if(searchLoginTerm || searchEmailTerm) {
            LengthFlag = true
            filter = {
                $or: [
                    filterLogin,
                    filterEmail
                ]
            }
        }

        /*if(searchLoginTerm || searchEmailTerm){
            filter = {
                $or: [
                    //{login: null},
                    {login: {$regex: searchLoginTerm, $options: 'i'}},
                    {email: {$regex: searchEmailTerm, $options: 'i'}},
                        ]
                    }
        }*/

        const users = await userCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber-1)*pageSize)
            .limit(+pageSize)
            .toArray()

        //const total = users.length
        let totalCount = await userCollection.countDocuments()
        //let totalCount = await userCollection.countDocuments(filter)

        if(LengthFlag){      //if there is filter
            totalCount = users.length
        }

        const pagesCount = Math.ceil(totalCount/pageSize)
        return {
            pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount,
            items: users.map(userMapper)
        }
    }

    static async getUserByLoginOrEmail(login: string, email: string): Promise<UserModel| null>{
        const user  = await userCollection.findOne({$or: [{login: login}, {email: email}]})
        if(!user){
            return null
        }
        return userMapper(user)
    }


}