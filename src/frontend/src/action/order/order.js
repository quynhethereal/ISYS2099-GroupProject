import * as api from "../../api/order.js";

export const createOrder = async (token, cart) => {
  try {
    const respone = await api.createOrder(token, cart);

    return respone;
  } catch (error) {
    console.log(error);
  }
};
