import axios from "axios";

const backend_url = "http://localhost:4000";

export const getAllProduct = (nextId, limit) =>
  axios.get(`${backend_url}/api/products?nextId=${nextId}&limit=${limit}`);
