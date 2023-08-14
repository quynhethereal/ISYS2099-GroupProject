import * as api from "../../api/product.js";

export const loginUser = async (requestLimit) => {
  try {
    const { data } = await api.getAllProduct(requestLimit);

    return data;
  } catch (error) {
    console.log(error.message);
  }
};
