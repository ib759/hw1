import {userCollection} from "../../db/db";
import {ObjectId} from "mongodb";
import {UserDbType} from "../types/db/db";
import {QueryUserInputModel} from "../types/users/query.user.input.model";
import {QueryUserOutputModel} from "../types/users/query.user.output.model";
import {CreateUserModel} from "../types/users/input.users.model";
import {UserModel} from "../types/users/output.users.model";
import {userMapper} from "../types/users/mappers/user-mapper";

export class UserRepository {

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

        const totalCount = await userCollection.countDocuments()
        const pagesCount = Math.ceil(totalCount/pageSize)
        return {
            pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount,
            items: users.map(userMapper)
        }
    }

    static async getUserById(id:string): Promise<UserModel | null>{
        const user = await userCollection.findOne({_id: new ObjectId(id)})
        if(!user){
            return null
        }
        return userMapper(user)
    }

    static async getUserByLogin(login:string): Promise<UserDbType | null>{
        const user  = await userCollection.findOne({login: login})
        if(!user){
            return null
        }
        return user
    }

    static async createUser(createdUser: CreateUserModel): Promise<UserModel|undefined>{
        const createdAt = new Date()

        const newUser: UserDbType = {
            ...createdUser,
            createdAt: createdAt.toISOString(),
        }
        const user = await userCollection.insertOne(newUser)

        return {
            ...newUser,
            id: user.insertedId.toString()
        }
    }

    static async deleteUserById(id:string): Promise<boolean>{
        const post = await userCollection.deleteOne({_id: new ObjectId(id)})
        return !!post.deletedCount;
    }
}