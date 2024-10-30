export interface IGymOpeningHours {
    endOpeningHoursUTCSunday: string,
    gymOpeningHoursExternalId: string,
    startOpeningHoursUTCSunday: string,
    endOpeningHoursUTCSaturday: string,
    startOpeningHoursUTCSaturday: string,
    endOpeningHoursUTCMondayToFriday: string,
    startOpeningHoursUTCMondayToFriday: string
}

export interface IGymChannel{
    inputChannel: string,
    outputChannel: string,
    customerGym: string
}

export interface IGym {
    name: string,
    unit: string,
    timezone: number,
    customer: string,
    gymExternalId: string,
    gymOpeningHoursResponse: IGymOpeningHours,
    channelResponse: IGymChannel | null
}
export interface IGymUpdateRequest {
    name: string;
    unit: string;
    timezone: number;
    customer?: string,
    gymExternalId: string,
    gymOpeningHoursUpdateRequest: IGymOpeningHours;
}

export interface IGymCreateRequest {
    name: string;
    unit: string;
    timezone: number;
    customer: string,
    gymExternalId?: string,
    gymOpeningHoursRequest: IGymOpeningHours;
    channelRequest: IGymChannel | null
}


// export interface IGymRequest