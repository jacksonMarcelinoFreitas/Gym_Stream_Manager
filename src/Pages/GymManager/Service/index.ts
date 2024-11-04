/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGymUpdateRequest, IGymCreateRequest } from "../../../Interfaces/IGym";
import { IListAllUserGym } from "../../../Interfaces/IListAllUserGym";
import api from "../../../Services/api";
import { toast } from "react-toastify";

type IListAllGyms = IListAllUserGym

export const useGym = () => {

    const handleListAllGymsService = async (data: IListAllGyms) => {
        try {
            const response = await api.get('/v1/gym', {
                params: {
                    'page': data.page,
                    'size': data.size,
                    'sort': data.sort,
                    'name': data.name,
                    'active': data.active,
                    'customer': data.customer,
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

    return {handleEditGymService, handleListAllGymsService, 
            handleDeleteGymService, handleCreateGymService, 
            handleActivateGymService};
}