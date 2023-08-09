import axios from "axios";

const backend_url = "http://localhost:4000";

export const login = (formData) =>
  axios.post(`${backend_url}/api/auth`, formData);
