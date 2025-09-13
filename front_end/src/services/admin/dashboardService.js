import { getAuth } from "../../utils/requestAdmin";

export const getDash = async () => {
    const result = await getAuth(`/dashboard`);
    return result;
};
