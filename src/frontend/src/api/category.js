import axios from "axios";

const backend_url = "http://localhost:4000";

export const getAllCategory = () => axios.get(`${backend_url}/api/category`);

export const getAllFlatternCategory = () =>
  axios.get(`${backend_url}/api/category/seller`);

export const getCategoryByID = (id) =>
  axios.get(`${backend_url}/api/category/${id}`);

export const getAllAttribute = (id) =>
  axios.get(`${backend_url}/api/product/${id}/attributes`);

export const createCategory = (token, formData) =>
  axios.post(`${backend_url}/api/category`, formData, {
    headers: { "x-access-token": token },
  });
export const updateCategory = (token, id, formData) =>
  axios.put(`${backend_url}/api/category/${id}`, formData, {
    headers: { "x-access-token": token },
  });

export const createSubCategory = (token, id, formData) =>
  axios.put(`${backend_url}/api/category/${id}/subcategory`, formData, {
    headers: { "x-access-token": token },
  });
