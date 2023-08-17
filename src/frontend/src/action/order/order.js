import * as api from "../../api/order.js";

export const createOrder = async (token, cart) => {
  try {
    const { data, status } = await api.createOrder(token, cart);

    return data;
  } catch (error) {
    console.log(error);
  }
};
