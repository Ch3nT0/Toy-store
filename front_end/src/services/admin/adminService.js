import { post } from "../../utils/requestAdmin";

export const loginAdmin = async () => {
    const result = await post(`/login`);
    return result
};
