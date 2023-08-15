import * as api from "../../api/product.js";

export const getAllProduct = async (nextId, limit) => {
  try {
    const { data } = await api.getAllProduct(nextId, limit);

    return data;
  } catch (error) {
    console.log(error.message);
  }
};
