import { getAuth } from "../../utils/requestAdmin";

export const getListUser = async () => {
    const result = await getAuth(`/users/list`);
    return result;
};
