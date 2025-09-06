import { post } from "../../utils/request";

export const createAnswer = async(option)=>{
    const result = await post(`answers`,option);
    return result;
}