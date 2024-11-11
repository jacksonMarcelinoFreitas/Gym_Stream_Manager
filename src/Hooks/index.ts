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

    const convertToUTC = (localUTCDateString: string) => {
        const date = new Date(localUTCDateString);

        if (isNaN(date.getTime())) {
            throw new Error('Invalid date string');
        }

        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    const convertHourToUTC = (localHourString: string) => {
        const [hours, minutes] = localHourString.split(':').map(Number);

        if (isNaN(hours) || isNaN(minutes)) {
            throw new Error('Invalid time string');
        }

        const localDate = new Date();
        localDate.setHours(hours, minutes, 0, 0);

        const utcHours = String(localDate.getUTCHours()).padStart(2, '0');
        const utcMinutes = String(localDate.getUTCMinutes()).padStart(2, '0');

        return `${utcHours}:${utcMinutes}`
    }

    //tentar deixar flexível 
    const convertToLocalHour = (utcHourString: string): string => {
        const [horas, minutos] = utcHourString.split(':').map(Number);

        let novaHora = horas - 3;
        const novosMinutos = minutos;

        if (novaHora < 0) {
            novaHora = 24 + novaHora;
        } else if (novaHora >= 24) {
            novaHora = novaHora - 24;
        }

        return `${novaHora.toString().padStart(2, '0')}:${novosMinutos.toString().padStart(2, '0')}`;

    };

    return { getUTCTimeRange, getTimeRange, convertToLocalUTC, convertToUTC, convertHourToUTC, convertToLocalHour};
}