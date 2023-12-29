import {PostDbType} from "../../db/db";
import {WithId} from "mongodb";
import {PostModel} from "../output";

export const postMapper = (postDb: WithId<PostDbType>): PostModel =>{
    return{
        id: postDb._id.toString(),
        title: postDb.title,
        shortDescription: postDb.shortDescription,
        content: postDb.content,
        blogId: postDb.blogId,
        blogName: postDb.blogName,
        createdAt: postDb.createdAt
    }
}