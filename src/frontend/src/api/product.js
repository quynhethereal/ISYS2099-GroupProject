import axios from "axios";

const backend_url = "http://localhost:4000";

export const getAllProduct = (data) =>
  axios.get(`${backend_url}/api/products`, data);
