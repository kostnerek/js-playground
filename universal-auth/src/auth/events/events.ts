export const AuthEventsTopics = {
    AUTH_USER_VERIFY_ACCOUNT: 'AUTH_USER_VERIFY_ACCOUNT',
    AUTH_USER_RESET_PASSWORD: 'AUTH_USER_RESET_PASSWORD',
}

export class AuthUserVerifyAccountEvent {
    constructor(public readonly payload: {
        email: string
    }) {}
}

export class AuthUserResetPasswordEvent {
    constructor(public readonly payload: {
        email: string
    }) {}
}