import { get } from "../../utils/request";

export const getThumb = async () => {
    const result = await get(`about`);
    return result?.data?.thumb || [];
};

export const getAbout = async (id) => {
    const result = await get(`about`);
    const { thumb, ...aboutWithoutThumb } = result.data;
    return aboutWithoutThumb;
}
