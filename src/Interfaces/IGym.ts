export interface IGymOpeningHours {
    endOpeningHoursUTCSunday: string,
    gymOpeningHoursExternalId: string,
    startOpeningHoursUTCSunday: string,
    endOpeningHoursUTCSaturday: string,
    startOpeningHoursUTCSaturday: string,
    endOpeningHoursUTCMondayToFriday: string,
    startOpeningHoursUTCMondayToFriday: string
}

export interface IGym {
    name: string,
    unit: number,
    timezone: number,
    customer: string,
    gymExternalId: string,
    gymOpeningHoursResponse: IGymOpeningHours,
}