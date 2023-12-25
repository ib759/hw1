import {Router, Request, Response} from "express";
import {db} from "../../db/db";

export const testingRoute = Router({})

testingRoute.delete('/all-data', (req: Request, res: Response) => {

    db.blogs.length = 0;
    db.posts.length = 0;

    res.sendStatus(204)
})
