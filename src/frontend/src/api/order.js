import axios from "axios";

const backend_url = "http://localhost:4000";

export const createOrder = (token, cart) =>
  axios.post(`${backend_url}/api/order`, cart, {
    headers: { "x-access-token": token },
  });

export const getAllOrderByUser = (token, state) =>
  axios.get(`${backend_url}/api/order?status=${state}`, {
    headers: { "x-access-token": token },
  });

export const rejectOrder = (token, id) =>
  axios.put(`${backend_url}/api/order/${id}/reject`, null, {
    headers: { "x-access-token": token },
  });

export const acceptOrder = (token, id) =>
  axios.put(`${backend_url}/api/order/${id}/accept`, null, {
    headers: { "x-access-token": token },
  });

export const getOrderById = (token, id) =>
  axios.get(`${backend_url}/api/order/${id}`, {
    headers: { "x-access-token": token },
  });
