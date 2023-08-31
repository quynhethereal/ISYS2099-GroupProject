import * as api from "../../api/product.js";

export const getAllProduct = async (nextId, limit) => {
  try {
    const { data } = await api.getAllProduct(nextId, limit);

    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const getProductById = async (id) => {
  try {
    const { data } = await api.getProductById(id);

    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const getProductInInventory = async (token, id) => {
  try {
    const { data } = await api.getProductInInventory(token, id);

    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const getProductBySellerId = async (token, currentPage, limit) => {
  try {
    const { data } = await api.getProductBySellerId(token, currentPage, limit);

    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const updateProductQuantity = async (token, id, formData) => {
  try {
    const { data } = await api.updateProductQuantity(token, id, formData);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (token, id, formData) => {
  try {
    const { data } = await api.updateProduct(token, id, formData);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const uploadImage = async (token, id, imgData) => {
  try {
    const { data } = await api.updateProduct(token, id, imgData);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const searchBySearchKey = async (
  searchKey,
  sortDirection1,
  sortedTerm1,
  sortedTerm2,
  sortDirection2
) => {
  try {
    const { data } = await api.searchBySearchKey(
      searchKey,
      sortDirection1,
      sortedTerm1,
      sortedTerm2,
      sortDirection2
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const searchByPrice = async (
  minPrice,
  maxPrice,
  sortDirection,
  sortedTerm,
  limit,
  currentPage
) => {
  try {
    const { data } = await api.searchByPrice(
      minPrice,
      maxPrice,
      sortDirection,
      sortedTerm,
      limit,
      currentPage
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const searchByCategory = async (
  id,
  sortDirection,
  sortedTerm,
  limit,
  currentPage
) => {
  try {
    const { data } = await api.searchByCategory(
      id,
      sortDirection,
      sortedTerm,
      limit,
      currentPage
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};
