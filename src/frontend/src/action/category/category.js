import * as api from "../../api/category.js";

export const getAllCategory = async () => {
  try {
    const { data } = await api.getAllCategory();

    return data;
  } catch (error) {
    return;
  }
};
