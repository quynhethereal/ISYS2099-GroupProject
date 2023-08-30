import * as api from "../../api/order.js";

export const createOrder = async (token, cart) => {
  try {
    const respone = await api.createOrder(token, cart);

    return respone;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getAllOrderByUser = async (token, state) => {
  try {
    const respone = await api.getAllOrderByUser(token, state);

    if (respone.status === 200) {
      return respone?.data;
    } else {
      return;
    }
  } catch (error) {
    console.log(error?.response?.data?.message);
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
  } catch (error) {
    console.log(error?.response?.data?.message);
  }
};

export const acceptOrder = async (token, id) => {
  try {
    const respone = await api.acceptOrder(token, id);

    if (respone.status === 200) {
      return respone;
    } else {
      return;
    }
  } catch (error) {
    console.log(error?.response?.data?.message);
  }
};
export const getOrderById = async (token, id) => {
  try {
    const respone = await api.getOrderById(token, id);

    if (respone.status === 200) {
      return respone.data;
    } else {
      return;
    }
  } catch (error) {}
};
