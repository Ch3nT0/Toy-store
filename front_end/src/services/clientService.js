import {  delAuth, getAuth, postAuth, putAuth } from "../utils/request";

export const getClient = async () => {
    const result = await getAuth(`client/detail`);
    return result;
};

export const createClient = async (client) => {
    const result = await postAuth(`client/register`,client);
    return result;
};

export const updateClient = async (id,client) => {
    const result = await putAuth(`client/${id}`,client);
    return result;
};


export const deleteClient = async (id) => {
    const result = await delAuth(`client/${id}`);
    return result;
};