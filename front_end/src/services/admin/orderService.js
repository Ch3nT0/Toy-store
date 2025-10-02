import {  delAuth, getAuth, putAuth } from "../../utils/requestAdmin";

export const getOrders = async () => {
    const result = await getAuth(`/order`);
    return result;
};

export const getOrderById = async (id) => {
    const result = await getAuth(`/order/${id}`);
    return result;
};

export const deleteOrder = async (id) => {
    const result = await delAuth(`/order/${id}`);
    return result;
};

export const updateOrderStatus = async (id,status) => {
    const result = await putAuth(`/order/${id}/status`,{status});
    return result;
};