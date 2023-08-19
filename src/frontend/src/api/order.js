import axios from "axios";

const backend_url = "http://localhost:4000";

export const createOrder = (token, cart) =>
  axios.post(`${backend_url}/api/order`, cart, {
    headers: { "x-access-token": token },
  });
