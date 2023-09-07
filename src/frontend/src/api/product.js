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

export const deleteProduct = (token, id) =>
  axios.delete(`${backend_url}/api/product/${id}`, {
    headers: { "x-access-token": token },
  });

export const searchBySearchKey = (
  searchKey,
  sortDirection1,
  sortedTerm1,
  sortDirection2,
  sortedTerm2
) =>
  axios.get(
    `${backend_url}/api/products/search?key=${searchKey}&sortDirection1=${sortDirection1}&sortTerm1=${sortedTerm1}&sortDirection2=${sortDirection2}&sortTerm2=${sortedTerm2}`
  );

export const searchByPrice = (
  minPrice,
  maxPrice,
  sortDirection1,
  sortedTerm1,
  sortDirection2,
  sortedTerm2,
  limit,
  currentPage
) =>
  axios.get(
    `${backend_url}/api/products/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}&sortDirection1=${sortDirection1}&sortTerm1=${sortedTerm1}&sortDirection2=${sortDirection2}&sortTerm2=${sortedTerm2}&limit=${limit}&currentPage=${currentPage}`
  );

// /category/:id/products
export const searchByCategory = (
  id,
  sortDirection1,
  sortedTerm1,
  sortDirection2,
  sortedTerm2,
  limit,
  currentPage
) =>
  axios.get(
    `${backend_url}/api/category/${id}/products?sortDirection1=${sortDirection1}&sortTerm1=${sortedTerm1}&sortDirection2=${sortDirection2}&sortTerm2=${sortedTerm2}&limit=${limit}&currentPage=${currentPage}`
  );

export const createProduct = (token, formData) =>
  axios.post(`${backend_url}/api/product`, formData, {
    headers: { "x-access-token": token },
  });
