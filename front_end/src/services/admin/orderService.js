import {  delAuth, getAuth } from "../../utils/requestAdmin";

export const getOrders = async () => {
    const result = await getAuth(`/order`);
    return result;
};

export const deleteOrder = async (id) => {
    const result = await delAuth(`/order/${id}`);
    return result;
};