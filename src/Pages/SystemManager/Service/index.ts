import { toast } from "react-toastify";
import { api } from "../../../Services/api";
import { IUserGym } from "../../../Interfaces/IUserGym";

export interface IListAllUserGym{
    page: number,
    size: number,
    sort: string,
    active?: boolean,
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

type IUserGymType = Partial<IUserGym>;

export const useMovementGymUser = () => {

    const handleListAllUsersFromGym = async (data: IListAllUserGym) => {
        try {
            // const customerGym = 'GYM_TEST'
            const response = await api.get(`/v1/user-gym/${data.customer}`, {
                params: {
                    'page': data.page,
                    'size': data.size,
                    'sort': data.sort,
                    'startTime': data.startTime,
                    'finishTime': data.finishTime
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

    const handleListAllGyms = async (data: IListAllGyms) => {
        try {
            const response = await api.get('/v1/gym', {
                params: {
                    'page': data.page,
                    'size': data.size,
                    'sort': data.sort,
                    'active': data.active
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
                dateBirth: data.dateBirth,
                gender: data.gender,
                email: data.email,
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
                dateBirth: data.dateBirth,
                gender: data.gender,
                email: data.email,
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

    return { handleListAllUsersFromGym, handleListAllGyms, 
             createMovementGymUser, updateMovementGymUser, 
             editUserGymService, deleteUserGymService, createUserGym,
             handleActivateUserGymService };
}