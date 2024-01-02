import {Request} from "express";

export type RequestWithParams<P> = Request<P, {}, {}, {}>
export type RequestWithBody<B> = Request<{}, {}, B, {}>
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B, {}>
export type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>


//not used types from first homework
export const AvailableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160" ]
export type VideoDbType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: typeof AvailableResolutions
}

export type CreateVideoType = {
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions
}

export type InputModel = {
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    publicationDate: string
}

export type ErrorMessage = {
    message: string
    field: string
}

export type ErrorType = {
    errorsMessages: ErrorMessage[]
}
