export interface IMovementGymUser {
    movementGymUserExternalId: string;
    entryDateTime: string;
    departureDateTime: string | null;
    isDepartureDate: boolean;
    schedulingDepartureDateTime: {
        departureDateTime: string;
    };
}

export interface IUserGym {
    userGymExternalId: string;
    name: string;
    email: string;
    gender: string;
    active?: boolean,
    dateBirth: string;
    customerGym: string;
    numberTimesEnteredDay: number;
    movementGymUser: IMovementGymUser | null;
}