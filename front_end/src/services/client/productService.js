import { get } from "../../utils/request";

export const getProductTopDiscount = async () => {
    const result = await get(`products/Top/Discount`);
    return result;
};

export const getProductTopSale = async () => {
    const result = await get(`products/Top/Sale`);
    return result;
}

export const getProduct = async (page = 1, limit = 8, keyword = "", minPrice = "", maxPrice = "", discount = "") => {
    let url = `products?page=${page}&limit=${limit}&keyword=${encodeURIComponent(keyword)}`;

    if (minPrice !== "") url += `&minPrice=${minPrice}`;
    if (maxPrice !== "") url += `&maxPrice=${maxPrice}`;
    if (discount !== "") url += `&discount=${discount}`;
    const result = await get(url);
    return result;
};

export const getProductByID = async (id) => {
    const result = await get(`products/${id}`);
    return result;
}