import {outputSessionModel} from "../output.session.models";
import {devicesDBType} from "../../db/db";
import {WithId} from "mongodb";

export const sessionMapper = (sessionDB: WithId<devicesDBType>): outputSessionModel=>{
    return{
        ip: sessionDB.ip,
        title: sessionDB.title,
        lastActiveDate: sessionDB.lastActiveDate,
        deviceId: sessionDB.deviceId
    }
}