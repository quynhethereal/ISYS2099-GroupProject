import * as api from "../../api/auth.js";

export const loginUser = async (formData) => {
  try {
    const { data } = await api.loginUser(formData);

    return data;
  } catch (error) {
    return;
  }
};
