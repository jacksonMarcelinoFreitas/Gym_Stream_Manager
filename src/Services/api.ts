import axios, { AxiosError, AxiosInstance } from 'axios';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../Interfaces/IErrorResponse'

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
      if (error.response) {
          const errorMessage = error.response.data?.message || 'Erro inesperado. Tente novamente mais tarde.';
          toast.error(errorMessage);
      } else {
          toast.error('Erro na conexão com o servidor.');
      }
      return Promise.reject(error);
  }
);

export default api;