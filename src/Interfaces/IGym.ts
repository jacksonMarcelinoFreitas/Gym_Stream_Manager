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
    inputChannel?: string;
    outputChannel?: string;
    customerGym?: string;
}

export interface IGym {
    name: string,
    unit: string,
    timezone: number,
    customer: string,
    gymExternalId: string,
    active: boolean,
    channelResponse: IGymChannel | null
    gymOpeningHoursResponse: IGymOpeningHours,
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
    channelRequest: IGymChannel | null
    gymOpeningHoursRequest: IGymOpeningHours;
}
