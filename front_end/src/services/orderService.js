import {  getAuth } from "../utils/request";

export const getOrderByID = async () => {
    const result = await getAuth(`order`);
    return result;
};
