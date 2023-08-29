import axios from "axios";

const backend_url = "http://localhost:4000";

export const getAllProduct = (nextId, limit) =>
  axios.get(`${backend_url}/api/products?nextId=${nextId}&limit=${limit}`);

export const getProductById = (id) =>
  axios.get(`${backend_url}/api/product/${id}`);

export const getProductBySellerId = (token, currentPage, limit) =>
  axios.get(
    `${backend_url}/api/seller/products?currentPage=${currentPage}&limit=${limit}`,
    {
      headers: { "x-access-token": token },
    }
  );
