import {
    attemptsDBType,
    BlogDbType,
    CommentDbType,
    DBType,
    devicesDBType,
    PostDbType,
    tokenDBType,
    UserDbType
} from "../src/types/db/db";
import dotenv from 'dotenv'
dotenv.config()
import {MongoClient} from "mongodb"
import mongoose from 'mongoose'
import { WithId } from 'mongodb'

const port = process.env.PORT || 3000
export const db: DBType = {
    blogs: [],
    posts: [],
    users: [],
    comments: [],
    tokens: [],
    sessions: [],
    attempts: []
}

const dbName = process.env.MONGO_dbName || 'blogs-hws'
//const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017' || 'mongodb://localhost:27017'
const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`
//MONGO_URL = mongodb+srv://ib759:Pass321@cluster0.lzytye2.mongodb.net/blogs-hws?retryWrites=true&w=majority
console.log(process.env.MONGO_URL)

const client = new MongoClient(mongoURI)
export const database = client.db('blogs-hws')

export const blogCollection = database.collection<BlogDbType>('blogs')
export const postCollection = database.collection<PostDbType>('posts')
export const userCollection = database.collection<UserDbType>('users')
export const commentCollection = database.collection<CommentDbType>('comments')
export const tokenCollection = database.collection<tokenDBType>('tokens')
export const sessionCollection = database.collection<devicesDBType>('sessions')
export const attemptCollection = database.collection<attemptsDBType>('attempts')

export const BlogSchema = new mongoose.Schema<WithId<BlogDbType>>({
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String, require: true },
    isMembership: { type: Boolean, require: true },
})

export const PostSchema = new mongoose.Schema<WithId<PostDbType>>({
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogId: { type: String, require: true },
    blogName: { type: String, require: true },
    createdAt: { type: String, require: true }
})

export const UserSchema = new mongoose.Schema<WithId<UserDbType>>({
    login: { type: String, require: true },
    password: { type: String, require: true },
    email: { type: String, require: true },
    createdAt: { type: String, require: true },
    emailConfirmation: {
        confirmationCode: { type: String, require: true },
        expirationDate: { type: String, require: true },
        isConfirmed: { type: String, require: true }
    }
})

export const CommentSchema = new mongoose.Schema<WithId<CommentDbType>>({
    content: { type: String, require: true },
    commentatorInfo: {
        userId: { type: String, require: true },
        userLogin: { type: String, require: true }
    },
    createdAt: { type: String, require: true },
    postId: { type: String, require: true } // dont mentioned in Swagger
})

export const SessionSchema = new mongoose.Schema<WithId<devicesDBType>>({
    ip: { type: String, require: true },
    title: { type: String, require: true },
    lastActiveDate: { type: String, require: true },
    deviceId: { type: String, require: true },
    userId: { type: String, require: true },
    issuedDate: { type: Number, require: true },
    expiredDate: { type: Number, require: true }
})
export const TokenSchema = new mongoose.Schema<WithId<tokenDBType>>({
    refreshToken: { type: String, require: true },
    userId: { type: String, require: true }
})
export const AttemptSchema = new mongoose.Schema<WithId<attemptsDBType>>({
    IP: { type: String, require: true },
    URL: { type: String, require: true },
    date: { type: Date, require: true },
    }
)

//export const BlogModelMongoose = mongoose.model<BlogDbType>('blogs', BlogSchema)
export const BlogModelMongoose = mongoose.model('blogs', BlogSchema)
export const PostModelMongoose = mongoose.model('posts', PostSchema)
export const UserModelMongoose = mongoose.model('users', UserSchema)
export const CommentModelMongoose = mongoose.model('comments', CommentSchema)
export const SessionModelMongoose = mongoose.model('sessions', SessionSchema)
export const TokenModelMongoose = mongoose.model('tokens', TokenSchema)
export const AttemptModelMongoose = mongoose.model('attempts', AttemptSchema)

export const runDb = async () => {
    try{
        //await client.connect()
        //await mongoose.connect(mongoURI + "/" + dbName)
        await mongoose.connect(mongoURI)
        console.log('Client connected to Db')
        console.log(`Example app listening on ${port}`)
    } catch (err){
        console.log(`${err}`)
        //await client.close()
        await mongoose.disconnect()
    }
}
//password Pass321