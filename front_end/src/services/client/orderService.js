import {  getAuth, postAuth } from "../../utils/request";

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