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
export const getProductInInventory = (token, id) =>
  axios.get(`${backend_url}/api/product/${id}/inventory`, {
    headers: { "x-access-token": token },
  });

export const updateProductQuantity = (token, id, formData) =>
  axios.put(`${backend_url}/api/product/${id}/quantity`, formData, {
    headers: { "x-access-token": token },
  });
export const updateProduct = (token, id, formData) =>
  axios.put(`${backend_url}/api/product/${id}`, formData, {
    headers: { "x-access-token": token },
  });
export const uploadImage = (token, id, imgData) =>
  axios.put(`${backend_url}/api/product/${id}/image`, imgData, {
    headers: { "x-access-token": token },
  });
