import { postAuth, getAuth, delAuth, patchAuth, putAuth } from "../utils/request";

export const getCart = async () => {
    return await getAuth("cart");
};

export const updateCart = async (productId, quantity) => {
    return await putAuth("cart", { productId, quantity });
};
export const removeFromCart = async (productId) => {
    return await delAuth(`cart/${productId}`);
};

export const increaseQuantity = async (productId) => {
    return await patchAuth(`cart/increase/${productId}`);
};


export const decreaseQuantity = async (productId) => {
    return await patchAuth(`cart/decrease/${productId}`);
}
