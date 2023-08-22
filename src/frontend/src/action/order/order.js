import * as api from "../../api/order.js";

export const createOrder = async (token, cart) => {
  try {
    const respone = await api.createOrder(token, cart);

    return respone;
  } catch (error) {
    console.log(error);
  }
};

export const getAllOrderByUser = async (token) => {
  try {
    const respone = await api.getAllOrderByUser(token);

    if (respone.status === 200) {
      return respone?.data;
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

export const rejectOrder = async (token, id) => {
  try {
    const respone = await api.rejectOrder(token, id);

    if (respone.status === 200) {
      return respone;
    } else {
      return;
    }
  } catch (error) {}
};

export const acceptOrder = async (token, id) => {
  try {
    const respone = await api.acceptOrder(token, id);

    if (respone.status === 200) {
      return respone;
    } else {
      return;
    }
  } catch (error) {}
};
