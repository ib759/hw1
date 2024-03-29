import {BlogModel} from "../blogs/output";
import {PostModel} from "../posts/output";
import {UserModel} from "../users/output.users.model";
import {CommentModel} from "../comments/output.comments.model";

export type DBType = {
    blogs: BlogModel[],
    posts: PostModel[],
    users: UserModel[],
    comments: CommentModel[],
    tokens: tokenDBType[],
    sessions: devicesDBType[],
    attempts: attemptsDBType[]
}

export type BlogDbType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type PostDbType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type ConfirmationInfoDBType = {
        confirmationCode: string
        expirationDate: string
        isConfirmed: boolean
}

export type UserDbType = {
    login: string,
    password: string,
    email: string,
    createdAt: string
    emailConfirmation: {
                confirmationCode: string
                expirationDate: string
                isConfirmed: boolean
                    }
}

export type CommentDbType = {
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    postId: string // dont mentioned in Swagger
}

export type tokenDBType = {
    refreshToken: string
    userId: string
}

export type devicesDBType = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
    userId: string
    issuedDate: number
    expiredDate: number
}

export type attemptsDBType = {
    IP: string
    URL: string
    date: Date
}