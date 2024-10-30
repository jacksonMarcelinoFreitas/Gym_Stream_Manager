import { toast } from "react-toastify";
import { api } from "../../../Services/api";
import { IGym, IGymOpeningHours, IGymUpdateRequest, IGymCreateRequest } from "../../../Interfaces/IGym";

export interface IListAllUserGym{
    page: number,
    size: number,
    sort: string,
    customer?: string,
    startTime?: string,
    finishTime?: string,
}

type IListAllGyms = IListAllUserGym

export interface ICreateMovement{
    userGymExternalId: string,
    minutesToLeave: number,
    customerGym: string
}
export interface IUpdateMovement{
    movementGymUserExternalId: string,
    customerGym: string,
}

export interface IGymType extends Omit<Partial<IGym>, 'gymOpeningHoursResponse'> {
    gymOpeningHoursUpdateRequest: IGymOpeningHours | null,
}

export const useGym = () => {

    const handleListAllGyms = async (data: IListAllGyms) => {
        try {
            const response = await api.get('/v1/gym', {
                params: {
                    'page': data.page,
                    'size': data.size,
                    'sort': data.sort,
                }
            });
            return { data: response.data, status: response.status };
        } catch (error: any) {
            if (error.response) {
                toast.error(`${error.response.data.message}`);
            } else {
                toast.error(`Não foi possível obter os dados de usuários.`);
            }
            return { data: error.status };
        }
    };

    const handleCreateGymService = async (data: IGymCreateRequest) => {
        try {
            const response = await api.post(`/v1/gym`, {
                name: data.name,
                unit: data.unit,
                timezone: data.timezone,
                customer: data.customer,
                gymOpeningHoursRequest: data.gymOpeningHoursRequest,
                channelRequest: data.channelRequest
            })

            return { data: response.data, status: response.status };
        } catch (error: any) {
            if (error.response) {
                toast.error(`${error.response.data.message}`);
            } else {
                toast.error(`Não foi atualizar a academia!`);
            }
            return { data: error.status };
        }
    }

    const handleEditGymService = async (data: IGymUpdateRequest) => {
        try {
            const response = await api.put(`/v1/gym/${data.gymExternalId}`, {
                name: data.name,
                unit: data.unit,
                timezone: data.timezone,
                gymOpeningHoursUpdateRequest: data.gymOpeningHoursUpdateRequest,
            })

            return { data: response.data, status: response.status };
        } catch (error: any) {
            if (error.response) {
                toast.error(`${error.response.data.message}`);
            } else {
                toast.error(`Não foi atualizar a academia!`);
            }
            return { data: error.status };
        }
    }

    const handleDeleteGymService = async (gymExternalId: string) => {
        try {
            
            const response = await api.delete(`/v1/gym/${gymExternalId}`)
            return { message: response.data.message, status: response.data.code };

        } catch (error: any) {
            if (error.response) {
                toast.error(`${error.response.data.message}`);
            } else {
                toast.error(`Não foi possível excluir a academia.`);
            }
            return { data: error.status };
        }
    }

    const handleActivateGymService = async (gymExternalId: string) =>{
        try {
            const response = await api.put(`/v1/gym/reactivate-gym/${gymExternalId}`)
            return { data: response.data, status: response.status };
        } catch (error: any) {
            if (error.response) {
                toast.error(`${error.response.data.message}`);
            } else {
                toast.error(`Não foi possível ativar a academia.`);
            } 
        }

    }

    return { handleEditGymService, handleListAllGyms, handleDeleteGymService, handleCreateGymService, handleActivateGymService };
}