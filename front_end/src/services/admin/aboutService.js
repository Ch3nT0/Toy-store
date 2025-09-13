import {  getAuth, patchAuth } from "../../utils/requestAdmin";

export const getThumb = async () => {
    const result = await getAuth(`about`);
    return result?.data?.thumb || [];
};

export const getAbout = async () => {
    const result = await getAuth(`about`);
    const { thumb, ...aboutWithoutThumb } = result.data;
    return aboutWithoutThumb;
}

export const getAboutUs = async () => {
    const result = await getAuth(`/aboutUs`);
    return result;
}

export const updateAbout = async (data) => {
    const result = await patchAuth(`/aboutUs`,data);
    return result;
}