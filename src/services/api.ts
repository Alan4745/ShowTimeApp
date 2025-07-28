import axios from 'axios';
import {API_URL} from '@env'
export const api = axios.create({
    baseURL: `${API_URL}/api`,
});

// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = token;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export const getDataApi = (endpoint: string) => {
    return api.get(endpoint).then((response) => {
        return response.data;
    }).catch(err => {
        return err;
    })
}

export const postDataApi = async (endpoint: string, data: any) => {
    return await api.post(endpoint, data).then((response) => {
        return response.data;
    }).catch((err) => {
        return err.response.data;
    })
}

export const putDataApi = async (endpoint: string, data: any) => {
    return await api.put(endpoint, data).then((response) => {
        return response.data;
    }).catch((err) => {
        return err.response.data;
    })
}

export const deleteDataApi = async (endpoint: string) => {
    return await api.delete(endpoint).then((response) => {
        return response.data;
    }).catch((err) => {
        return err.response.data;
    })
}