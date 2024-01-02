import {BlogDbType, DBType, PostDbType} from "../src/types/db/db";
import dotenv from 'dotenv'
dotenv.config()
import {MongoClient} from "mongodb"

const port = process.env.PORT || 3000
export const db: DBType = {
    blogs: [],
    posts: []
}

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017' || 'mongodb://localhost:27017'
//MONGO_URL = mongodb+srv://ib759:Pass321@cluster0.lzytye2.mongodb.net/blogs-hws?retryWrites=true&w=majority
console.log(process.env.MONGO_URL)

const client = new MongoClient(mongoURI)
export const database = client.db('blogs-hws')

export const blogCollection = database.collection<BlogDbType>('blogs')
export const postCollection = database.collection<PostDbType>('posts')

export const runDb = async () => {
    try{
        await client.connect()
        console.log('Client connected to Db')
        console.log(`Example app listening on ${port}`)
    } catch (err){
        console.log(`${err}`)
       await client.close()
    }
}
//password Pass321