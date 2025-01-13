import {attemptCollection, AttemptModelMongoose} from "../../db/db";
import {subSeconds} from "date-fns";

export class AttemptRepository {
   static async getAllDocumentsForPeriodOfTime(ipUser: string, URL: string, period: number):Promise<number|null>{
       try{
           const attempts = await AttemptModelMongoose
               .countDocuments({$and:[{IP: ipUser},{URL: URL},{date: {$gte: subSeconds(new Date(), period)}}]})
           return attempts
       } catch (e:any) {
           return null
       }
   }

   static async addNewAttempt(IP: string, URL: string): Promise<string|null>{
       try{
           const isInserted = await AttemptModelMongoose.insertMany([{IP, URL, date: new Date()}])
           return isInserted[0]._id.toString()
       } catch (e: any) {
           return null
       }

   }
}