import { getAuth, post, postAuth } from "../../utils/request";
export const login = async (email, password) => {
    const result = await post(`users/login`, { email, password });
    return result;
}
export const register = async (option) => {
    const result = await post(`users/register`, option);
    return result;
}

export const forgotPassword = async (email) => {
    const result = await post("users/password/forgot", { email });
    return result;
};

export const verifyOtp = async (email, otp) => {
    const result = await post("users/password/otp", { email, otp });
    return result;
};

export const resetPassword = async (password) => {
    const result = await postAuth("users/password/reset", { password });
    return result;
};

export const getUserByID = async () => {
    const result = await getAuth(`users/detail`);
    return result;
};
