import axios from "axios";

const backend_url = "http://localhost:4000";

export const createOrder = (token, cart) =>
  axios.post(`${backend_url}/api/order`, cart, {
    headers: { "x-access-token": token },
  });

export const getAllOrderByUser = (token) =>
  axios.get(`${backend_url}/api/order?status=pending`, {
    headers: { "x-access-token": token },
  });

export const rejectOrder = (token, id) => {
  axios.put(`${backend_url}/api/order/${id}/accept`, {
    headers: { "x-access-token": token },
  });
};

export const acceptOrder = (token, id) => {
  axios.put(`${backend_url}/api/order/${id}/reject`, {
    headers: { "x-access-token": token },
  });
};
