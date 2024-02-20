import {Router, Request, Response} from "express";
import {
    attemptCollection,
    blogCollection,
    commentCollection,
    database,
    db,
    postCollection, sessionCollection,
    tokenCollection,
    userCollection
} from "../../db/db";

export const testingRoute = Router({})

testingRoute.delete('/all-data', async (req: Request, res: Response) => {

    //await database.dropDatabase()
    await blogCollection.deleteMany({})
    await postCollection.deleteMany({})
    await userCollection.deleteMany({})
    await commentCollection.deleteMany({})
    await tokenCollection.deleteMany({})
    await sessionCollection.deleteMany({})
    await attemptCollection.deleteMany({})
    res.sendStatus(204)
})
