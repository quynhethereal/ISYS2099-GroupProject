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
