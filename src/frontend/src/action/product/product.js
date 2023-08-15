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
