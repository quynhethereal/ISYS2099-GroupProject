import axios from "axios";

const backend_url = "http://localhost:4000";

export const getAllCategory = () => axios.get(`${backend_url}/api/category`);

export const getAllFlatternCategory = () =>
  axios.get(`${backend_url}/api/category/seller`);

export const getCategoryByID = (id) =>
  axios.get(`${backend_url}/api/category/${id}`);

export const getAllAttribute = (id) =>
  axios.get(`${backend_url}/api/product/${id}/attributes`);
