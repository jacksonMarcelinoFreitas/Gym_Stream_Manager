import { AxiosError } from "axios";
import api from "../../../Services/api";

export const useResource = () => {

    const handleCreateResourceService = async (name: string) => {
        try {
            const response = await api.post(`/v1/resource-setting`, {
                name: name
            })
            return { data: response.data, status: response.status };

        } catch (error) {

            return { data: null, status: (error as AxiosError).response?.status };
        }
    }

    const handleDeleteResourceService = async (resourceSettingExternalId: string) => {
        try {
            const response = await api.delete(`/v1/resource-setting/${resourceSettingExternalId}`)

            return { data: response.data, status: response.status };

        } catch (error) {

            return { data: null, status: (error as AxiosError).response?.status };
        }
    }

    const handleListAllResourceService = async () => {
        try {
            const response = await api.get(`/v1/resource-setting`)

            return { data: response.data, status: response.status };

        } catch (error) {

            return { data: null, status: (error as AxiosError).response?.status };
        }
    }
    
    return { handleCreateResourceService, handleDeleteResourceService, handleListAllResourceService };
}