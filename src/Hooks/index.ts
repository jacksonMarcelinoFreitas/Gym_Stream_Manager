import { IGymOpeningClosingHours } from "../Interfaces/IGymOpeningClosingHours";

export const useTimeresources = () => {
    const getUTCTimeRange = (
        openingHoursUTC: string, 
        closingHoursUTC: string
    ): IGymOpeningClosingHours => {
        const [localStartHour, localStarMinute] = openingHoursUTC.split(':');
        const [localEndHour, localEndMinute] = closingHoursUTC.split(':');
        const localDateStartHour = new Date();
        const localDateEndHour = new Date();

        if(localStartHour >= localEndHour) {
            localDateEndHour.setDate(localDateEndHour.getDate() + 1)
        }

        const timezoneOffset = new Date().getTimezoneOffset() / 60;
        const startDateUTC = new Date(Date.UTC(localDateStartHour.getFullYear(), localDateStartHour.getMonth(), localDateStartHour.getDate(), parseInt(localStartHour) + timezoneOffset, parseInt(localStarMinute), 0));
        const endDateUTC = new Date(Date.UTC(localDateEndHour.getFullYear(), localDateEndHour.getMonth(), localDateEndHour.getDate(), parseInt(localEndHour) + timezoneOffset, parseInt(localEndMinute), 0));
        const startTime = startDateUTC.toISOString().slice(0, 19);
        const finishTime = endDateUTC.toISOString().slice(0, 19);

        return { startTime, finishTime };
    }

    const getTimeRange = (
        openingHoursUTC: string, 
        closingHoursUTC: string
    ): IGymOpeningClosingHours => {
        const [localStartHour, localStarMinute] = openingHoursUTC.split(':');
        const [localEndHour, localEndMinute] = closingHoursUTC.split(':');
        const localDateStartHour = new Date();
        const localDateEndHour = new Date();

        if(localStartHour >= localEndHour) {
            localDateEndHour.setDate(localDateEndHour.getDate() + 1)
        }

        const startDateUTC = new Date(Date.UTC(localDateStartHour.getFullYear(), localDateStartHour.getMonth(), localDateStartHour.getDate(), parseInt(localStartHour), parseInt(localStarMinute), 0));
        const endDateUTC = new Date(Date.UTC(localDateEndHour.getFullYear(), localDateEndHour.getMonth(), localDateEndHour.getDate(), (parseInt(localEndHour)), parseInt(localEndMinute), 0));
        const startTime = startDateUTC.toISOString().slice(0, 19);
        const finishTime = endDateUTC.toISOString().slice(0, 19);

        return { startTime, finishTime };
    }

    const convertToLocalUTC = (utcDateString: string): string => {
        const utcDate = new Date(utcDateString);
        const localOffsetInMinutes = utcDate.getTimezoneOffset();
        const localOffsetInMs = localOffsetInMinutes * 60 * 1000;
        const localDate = new Date(utcDate.getTime() - localOffsetInMs);
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        const hours = String(localDate.getHours()).padStart(2, '0');
        const minutes = String(localDate.getMinutes()).padStart(2, '0');
        const seconds = String(localDate.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    return { getUTCTimeRange, getTimeRange, convertToLocalUTC };
}