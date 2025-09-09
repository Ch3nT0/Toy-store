import { get } from "../../utils/requestAdmin";

export const getDash = async () => {
    const result = await get(`/dashboard`);
    return result;
};
