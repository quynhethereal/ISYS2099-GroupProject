import * as api from "../api/auth.js";

export const login = async (formData) => {
  try {
    const { data } = await api.login(formData);
    console.log("the user is: ", data);
  } catch (error) {}
};
