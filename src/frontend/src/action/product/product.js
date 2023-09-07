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

export const deleteProduct = async (token, id) => {
  try {
    const res = await api.deleteProduct(token, id);

    if (res.status === 200) {
      const { data } = res;
      return data;
    } else {
      return res;
    }
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
  sortDirection1,
  sortedTerm1,
  sortDirection2,
  sortedTerm2,
  limit,
  currentPage
) => {
  try {
    const { data } = await api.searchByPrice(
      minPrice,
      maxPrice,
      sortDirection1,
      sortedTerm1,
      sortDirection2,
      sortedTerm2,
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
  sortDirection1,
  sortedTerm1,
  sortDirection2,
  sortedTerm2,
  limit,
  currentPage
) => {
  try {
    const { data } = await api.searchByCategory(
      id,
      sortDirection1,
      sortedTerm1,
      sortDirection2,
      sortedTerm2,
      limit,
      currentPage
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createProduct = async (token, formData) => {
  try {
    const res = await api.createProduct(token, formData);
    if (res?.status === 200) {
      const { data } = res;
      return data;
    }
    // return data;
  } catch (error) {
    console.log(error);
  }
};
