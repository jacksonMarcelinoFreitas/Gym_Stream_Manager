/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICreateMovement, IUpdateMovement } from "../../../Interfaces/IMovementGymUser";
import { IListAllUserGym } from "../../../Interfaces/IListAllUserGym";
import { IUserGym,  } from "../../../Interfaces/IUserGym";
import api from "../../../Services/api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

type IUserGymType = Partial<IUserGym>;

export const useMovementGymUser = () => {

    const handleListAllUsersFromGym = async (data: IListAllUserGym) => {
        try {
            const response = await api.get(`/v1/user-gym/${data.customer}`, {
                params: {
                    'page': data.page,
                    'size': data.size,
                    'sort': data.sort,
                    'name': data.name,
                    'email': data.email,
                    'active': data.active,
                    'startTime': data.startTime,
                    'finishTime': data.finishTime,
                }
            });
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: (error as AxiosError).response?.status };
        }
    };

    const createMovementGymUser = async (data: ICreateMovement) => {
        try {
            const response = await api.post('/v1/movement-gym-user', {
                userGymExternalId: data.userGymExternalId,
                minutes: data.minutesToLeave,
                customerGym: data.customerGym,
            })
            return { data: response.data, status: response.status };
        } catch (error: any) {
            if (error.response) {
                toast.error(`${error.response.data.message}`);
            } else {
                toast.error(`Não foi possível obter os dados de usuários.`);
            }
            return { data: error.status };
        }
        
    }

    const updateMovementGymUser = async (data: IUpdateMovement) => {
        try {
            const response = await api.put(`/v1/movement-gym-user/${data.movementGymUserExternalId}`, {
                customerGym: data.customerGym
            })
            return { data: response.data, status: response.status };
        } catch (error: any) {
            if (error.response) {
                toast.error(`${error.response.data.message}`);
            } else {
                toast.error(`Não foi possível realizar a saída do usuário.`);
            }
            return { data: error.status };
        }
        
    }

    const editUserGymService = async (data: IUserGymType) => {
        try {
            const response = await api.put(`/v1/user-gym/${data.userGymExternalId}`, {
                name: data.name,
                email: data.email,
                gender: data.gender,
                dateBirth: data.dateBirth,
                customerGym: data.customerGym
            })

            return { data: response.data, status: response.status };
        } catch (error: any) {
            if (error.response) {
                toast.error(`${error.response.data.message}`);
            } else {
                toast.error(`Não foi possível realizar a saída do usuário.`);
            }
            return { data: error.status };
        }
    }

    const deleteUserGymService = async (userGymExternalId: string) => {
        try {
            const response = await api.delete(`/v1/user-gym/${userGymExternalId}`)

            return { message: response.data.message, status: response.data.code };
        } catch (error: any) {
            if (error.response) {
                toast.error(`${error.response.data.message}`);
            } else {
                toast.error(`Não foi possível excluir o usuário.`);
            }
            return { data: error.status };
        }
    }

    const createUserGym = async (data: IUserGymType) => {
        try {
            const response = await api.post('/v1/user-gym',{
                name: data.name,
                email: data.email,
                gender: data.gender,
                dateBirth: data.dateBirth,
                customerGym: data.customerGym
            })
            return { data: response.data, status: response.status };
        } catch (error: any) {
            if (error.response) {
                toast.error(`${error.response.data.message}`);
            } else {
                toast.error(`Não foi possível criar o usuário.`);
            }
            return { data: error.status };
        }
    }

    const handleActivateUserGymService = async (userGymExternalId: string) =>{
        try {
            const response = await api.put(`/v1/user-gym/reactivate-user-gym/${userGymExternalId}`)
            return { data: response.data, status: response.status };
        } catch (error: any) {
            if (error.response) {
                toast.error(`${error.response.data.message}`);
            } else {
                toast.error(`Não foi possível criar o usuário.`);
            } 
        }

    }

    return { handleListAllUsersFromGym, 
             createMovementGymUser, updateMovementGymUser, 
             editUserGymService, deleteUserGymService, 
             createUserGym, handleActivateUserGymService };
}