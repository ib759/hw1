export type UserModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}
export type CurrentUserOutput = {
    email: string,
    login: string,
    userId: string
}