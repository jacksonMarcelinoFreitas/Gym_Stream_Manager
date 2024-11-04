/* eslint-disable @typescript-eslint/no-explicit-any */
import { IListAllUsers } from "../../../Interfaces/IUser";
import api from "../../../Services/api";
import { AxiosError } from "axios";

export const useUser = () => {

    const handleListAllUsersService = async (data: IListAllUsers) => {
        try {
            const response = await api.get(`/v1/user`, {
                params: {
                    'customerGym': data.customerGym,
                    'page': data.page,
                    'size': data.size,
                    'rows': data.rows,
                    'name': data.name,
                    'role': data.role,
                    'email': data.email,
                    'active': data.active,
                }
            });
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: (error as AxiosError).response?.status };
        }
    }

    const handleReleaseUserService = async (data: IListAllUsers) => {
        try {
            const response = await api.post(`/v1/user/release-admin-user-gym`, {
                'name': data.name,
                'email': data.email,
                'gender': data.gender,
                'dateBirth': data.dateBirth,
                'customerGym': data.customerGym
            });
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: (error as AxiosError).response?.status };
        }
    } 
    
    
    const handleEditUserService = async (data: IListAllUsers) => {
        try {
            const response = await api.put(`/v1/user/${data.userExternalId}`, {
                'name': data.name
            });
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: (error as AxiosError).response?.status };
        }
    }


    const handleDeleteUserService = async (userExternalId: string) => {
        try {
            const response = await api.delete(`/v1/user/${userExternalId}`);

            return { data: response.data, status: response.status };

        } catch (error) {

            return { message: null, status: (error as AxiosError).response?.status };

        }
    }

    const handleActivateUserService = async (userExternalId: string) =>{
        try {
            const response = await api.put(`/v1/user/reactivate-user/${userExternalId}`)

            return { data: response.data, status: response.status };

        } catch (error: any) {

            return { message: null, status: (error as AxiosError).response?.status }; 

        }

    }
    
    return { handleListAllUsersService, handleReleaseUserService, handleDeleteUserService, handleActivateUserService, handleEditUserService };
}