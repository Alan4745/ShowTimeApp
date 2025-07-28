import { LoginData, RegistrationData } from '../../context/RegistrationContext';
import { postDataApi } from '../api';

const authURL = '/auth';

interface RegisterResponse {
    token: string;
    message: string;
}

export const loginAPI = async (login: LoginData): Promise<RegisterResponse | null> => {
    try {
        return await postDataApi(`${authURL}/login`, login);
    } catch (err) {
        console.log(err);
        return null;
    }
}
export const registrationAPI = async (register: RegistrationData): Promise<RegisterResponse | null> => {
    try {
        return await postDataApi(`${authURL}/register`, register);
    } catch (err) {
        console.log(err);
        return null;
    }
}