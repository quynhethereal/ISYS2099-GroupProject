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
  token,
  searchKey,
  sortDirection,
  sortedTerm
) => {
  try {
    const { data } = await api.searchBySearchKey(
      token,
      searchKey,
      sortDirection,
      sortedTerm
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};
