import { getAuth, postAuth, putAuth } from "../../utils/request";

export const getOrderByID = async () => {
    const result = await getAuth(`order`);
    return result;
};


export const createOrderFromCart = async (client, paymentMethod) => {
    const res = await postAuth("order/cart", {
        fullName: client.fullName,
        address: client.address,
        phone: client.phone,
        paymentMethod,
    });
    return res;
};

export const updateOrderStatus = async (id,status) => {
    const result = await putAuth(`order/${id}`, status);
    return result;
};

export const orderProduct = async ({ product, client, paymentMethod, quantity }) => {
    const res = await postAuth("order", { product, client, paymentMethod, quantity });
    return res;
};