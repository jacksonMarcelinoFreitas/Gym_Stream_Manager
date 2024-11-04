export interface IMovementGymUser {
    movementGymUserExternalId: string,
    entryDateTime: string,
    departureDateTime: string,
    isDepartureDate: boolean,
    schedulingDepartureDateTime?: {
        departureDateTime: string
    }
}

export interface ICreateMovement{
    customerGym: string
    minutesToLeave: number,
    userGymExternalId: string,
}

export interface IUpdateMovement{
    customerGym: string,
    movementGymUserExternalId: string,
}