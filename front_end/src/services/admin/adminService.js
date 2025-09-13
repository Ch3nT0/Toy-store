import { post } from "../../utils/requestAdmin";

export const loginAdmin = async ({email,password}) => {
    const result = await post(`/login`,{email,password});
    return result
};
