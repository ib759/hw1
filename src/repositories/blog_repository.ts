import {db} from "../../db/db";
import {BlogModel} from "../types/blogs/output";

export class BlogRepository {
    static getAllBlogs(){
        return db.blogs
    }

    static getBlogById(id:string){
        return db.blogs.find(b => b.id === id)
    }

    static createBlog(name:string, description:string, websiteUrl:string){
        let newId = +(new Date())
        const newBlog: BlogModel = {
            id: newId.toString(),
            name,
            description,
            websiteUrl
        }

        db.blogs.push(newBlog)

        return newBlog
    }

    static updateBlogById(id:string, name:string, description:string, websiteUrl:string){
        let updatedBlog = db.blogs.find(b => b.id === id)
        if (updatedBlog){
            updatedBlog.name = name
            updatedBlog.description = description
            updatedBlog.websiteUrl = websiteUrl
            return true;
        } else {
            return false;
        }
    }

    static deleteBlogById(id:string){
        for (let i=0; i < db.blogs.length; i++) {
            if (db.blogs[i].id === id) {
                db.blogs.splice(i,1);
                return true;
            }
        }
        return false;
    }
}