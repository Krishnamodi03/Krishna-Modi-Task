import axios from "axios";

const BASE_URL = "https://ca65609e4771cde72662.free.beeceptor.com/api/contacts";

export const getContacts = () => axios.get(BASE_URL);
export const addContact = (data) => axios.post(BASE_URL, data);
export const updateContact = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteContact = (id) => axios.delete(`${BASE_URL}/${id}`); 