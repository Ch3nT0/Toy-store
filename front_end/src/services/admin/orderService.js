import {  delAuth, getAuth, putAuth } from "../../utils/requestAdmin";

export const getOrders = async (status,page=1) => {
    if(!status) {
        const result = await getAuth(`/order?page=${page}`);
        return result;
    }
    const result = await getAuth(`/order?status=${status}&page=${page}`);
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

export const getOrder6Months = async () => {
    const result = await getAuth(`/order/revenue/6-months`);
    return result;
};

export const updateOrderStatus = async (id,status) => {
    const result = await putAuth(`/order/${id}/status`,{status});
    return result;
};