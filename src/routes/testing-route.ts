import {Router, Request, Response} from "express";
import {blogCollection, database, db, postCollection} from "../../db/db";

export const testingRoute = Router({})

testingRoute.delete('/all-data', async (req: Request, res: Response) => {

    //await database.dropDatabase()
    await blogCollection.deleteMany({})
    await postCollection.deleteMany({})
    res.sendStatus(204)
})
