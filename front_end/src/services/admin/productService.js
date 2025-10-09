
import { getAuth, putAuth, postAuth, delAuth } from "../../utils/requestAdmin";

export const getProductTopDiscount = async () => {
    const result = await getAuth(`/products/Top/Discount`);
    return result;
};

export const getProductTopSale = async () => {
    const result = await getAuth(`/products/Top/Sale`);
    return result;
}

export const getProduct = async (page = 1, limit = 8, keyword = "") => {
    const result = await getAuth(`/products?page=${page}&limit=${limit}&keyword=${encodeURIComponent(keyword)}`);
    return result;
}

export const getProductByID = async (id) => {
    const result = await getAuth(`/products/${id}`);
    return result;
}

export const updateProduct = async (id,product) => {
    const result = await putAuth(`/products/${id}`,product);
    return result;
}

export const updateManyProducts = async (data) => {
    const result = await putAuth(`/products/update-many`,data);
    return result;
}

export const createProduct  = async (product) => {
    const result = await postAuth(`/products`,product);
    return result;
}

export const deleteProduct  = async (id) => {
    const result = await delAuth(`/products/${id}`);
    return result;
}