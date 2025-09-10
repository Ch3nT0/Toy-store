import { get } from "../../utils/requestAdmin";

export const getListUser = async () => {
    const result = await get(`/users/list`);
    return result;
};
