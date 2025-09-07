import {  getAuth, postAuth } from "../../utils/request";

export const getOrderByID = async () => {
    const result = await getAuth(`order`);
    return result;
};


export const createOrderFromCart = async (cartId, client, paymentMethod) => {
    console.log(cartId)
  const res = await postAuth("/order/cart", {
    cartId,
    fullName: client.fullName,
    address: client.address,
    phone: client.phone,
    paymentMethod,
  });
  return res.data;
};