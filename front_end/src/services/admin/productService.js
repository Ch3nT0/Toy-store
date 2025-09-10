
import { get, put,post, del } from "../../utils/requestAdmin";

export const getProductTopDiscount = async () => {
    const result = await get(`/products/Top/Discount`);
    return result;
};

export const getProductTopSale = async () => {
    const result = await get(`/products/Top/Sale`);
    return result;
}

export const getProduct = async (page = 1, limit = 8, keyword = "") => {
    const result = await get(`/products?page=${page}&limit=${limit}&keyword=${encodeURIComponent(keyword)}`);
    return result;
}

export const getProductByID = async (id) => {
    const result = await get(`/products/${id}`);
    return result;
}

export const updateProduct = async (id,product) => {
    const result = await put(`/products/${id}`,product);
    return result;
}

export const createProduct  = async (product) => {
    const result = await post(`/products`,product);
    return result;
}

export const deleteProduct  = async (id) => {
    const result = await del(`/products/${id}`);
    return result;
}