export interface IUser{
    name: string;
    email: string;
    role: string[];
    externalId: string;
    customer: string;
    exp: number;
    gym: string;
    gymExternalId: string;
    userGymExternalId: string;
}

export interface IListAllUsers{
    rows?: number,
    page?: number,
    size?: number,
    // sort: string,
    gender?: string, 
    name?: string,
    email?: string,
    role?: string,
    active?: boolean,
    dateBirth?: string,
    customerGym?: string
    userExternalId?: string,
    userGymExternalId?: string
}

export interface ICreateUser{
    name: string,
    email: string,
    password: string,
    readTerms: boolean,
    isUserAdmin: boolean
}

