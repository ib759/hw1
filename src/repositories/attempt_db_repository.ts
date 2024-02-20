import {attemptCollection} from "../../db/db";
import {addHours, addSeconds} from "date-fns";
import {attemptsDBType} from "../types/db/db";

export class AttemptRepository {
   static async getAllDocumentsForPeriodOfTime(ipUser: string,period: number):Promise<number|null>{
       try{
           const attempts = await attemptCollection
               .find({$and:[{IP: ipUser},{date: {$gte: addSeconds(new Date(), period)}}]})
               .toArray()
           return attempts.length
       } catch (e:any) {
           return null
       }
   }

   static async addNewAttempt(newAttempt: attemptsDBType): Promise<string|null>{
       try{
           const isInserted = await attemptCollection.insertOne(newAttempt)
           return isInserted.insertedId.toString()
       } catch (e) {
           return null
       }

   }
}