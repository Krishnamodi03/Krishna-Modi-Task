import { Axios } from "./axios";

export const getContacts = () => Axios.get("/contact");
export const addContact = (data) => Axios.post("/contact", data);
export const updateContact = (id, data) => Axios.put(`/contact/${id}`, data);
export const deleteContact = (id) => Axios.delete(`/contact/${id}`);
