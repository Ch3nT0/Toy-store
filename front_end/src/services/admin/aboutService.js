import { get, patch } from "../../utils/requestAdmin";

export const getThumb = async () => {
    const result = await get(`about`);
    return result?.data?.thumb || [];
};

export const getAbout = async () => {
    const result = await get(`about`);
    const { thumb, ...aboutWithoutThumb } = result.data;
    return aboutWithoutThumb;
}

export const getAboutUs = async () => {
    const result = await get(`/aboutUs`);
    return result;
}

export const updateAbout = async (data) => {
    const result = await patch(`/aboutUs`,data);
    return result;
}