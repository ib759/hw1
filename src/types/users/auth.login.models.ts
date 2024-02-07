
export type authLoginModels = {
    loginOrEmail: string,
    password: string
}

export type accessTokenModel = {
    accessToken: string
}
export type tokensModel = {
    accessToken: accessTokenModel
    refreshToken: string
}