import axios from "axios";

const backend_url = "http://localhost:4000";

export const getAllCategory = () => axios.get(`${backend_url}/api/category`);
