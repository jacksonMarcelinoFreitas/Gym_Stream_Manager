export interface IRegisterUser {
    name?: string;
    email?: string;
    password?: string;
    newPassword?: string;
    tokenEmail?: string;
    readTerms?: boolean,
    isUserAdmin?: boolean
}
