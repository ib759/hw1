import {BlogDbType} from "../../db/db";
import {WithId} from "mongodb";
import {BlogModel} from "../output";

export const blogMapper = (blogDb: WithId<BlogDbType>): BlogModel =>{
    return{
        id: blogDb._id.toString(),
        name: blogDb.name,
        description: blogDb.description,
        websiteUrl: blogDb.websiteUrl,
        createdAt: blogDb.createdAt,
        isMembership: blogDb.isMembership
    }
}