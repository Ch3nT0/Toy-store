import { get } from "../../utils/request";

export const getDash = async () => {
    const result = await get(`admin/dashboard`);
    return result;
};
