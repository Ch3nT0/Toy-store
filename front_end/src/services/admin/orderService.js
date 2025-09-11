import { del, get } from "../../utils/requestAdmin";

export const getOrders = async () => {
    const result = await get(`/order`);
    return result;
};

export const deleteOrder = async (id) => {
    const result = await del(`/order/${id}`);
    return result;
};